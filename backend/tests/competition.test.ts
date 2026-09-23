/// <reference types="jest" />
import request from 'supertest';
import mongoose from 'mongoose';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { createApp } from '../src/app';
import { connectDB, disconnectDB } from '../src/config/db';
import { Competition } from '../src/models/competition.model';
import { Registration } from '../src/models/registration.model';
import { calculateLifecycleStatus, calculateRegistrationEligibility } from '../src/utils/lifecycle';

const app = createApp();

describe('Competition & Registration Full-Stack Production Test Suite', () => {
  let testCompId: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    if (testCompId) {
      await Competition.findByIdAndDelete(testCompId);
      await Registration.deleteMany({ competitionId: testCompId });
    }
    await disconnectDB();
  });

  beforeEach(async () => {
    await Competition.deleteMany({ slug: { $regex: /^test-/ } });
    if (testCompId) {
      await Registration.deleteMany({ competitionId: testCompId });
    }

    // Create a pristine test competition with 3 spots
    const now = new Date();
    const comp = await Competition.create({
      title: 'Test Kathak Championship',
      slug: `test-kathak-${Date.now()}`,
      category: 'Dance',
      tags: ['Dance', 'Test'],
      badge: 'Certificate Included',
      prizePool: 2000,
      entryFee: 99,
      currency: '₹',
      capacity: 3,
      participantCount: 0,
      registrationStartAt: new Date(now.getTime() - 86400 * 1000), // opened yesterday
      registrationEndAt: new Date(now.getTime() + 86400 * 1000), // closes tomorrow
      submissionStartAt: new Date(now.getTime() + 86400 * 1000),
      submissionEndAt: new Date(now.getTime() + 5 * 86400 * 1000),
      resultDate: new Date(now.getTime() + 7 * 86400 * 1000),
      judge: {
        name: 'Manju Dubey',
        role: 'Judge',
        designation: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
      rewards: [
        { rank: 1, title: '1st Winner', amount: 1000 },
        { rank: 2, title: '2nd Winner', amount: 600 },
      ],
      judgingParameters: [
        { name: 'Taal', weightage: 50, description: 'Rhythm' },
      ],
      aboutDescription: 'A test competition for dance.',
      rules: ['Follow test rules.'],
      status: 'published',
    });

    testCompId = comp._id.toString();
  });

  describe('Section 5: Registration & Edge Case Tests (1 to 10)', () => {
    // 1. One successful registration
    it('1. should register a new participant successfully and decrement spots', async () => {
      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({
          participantId: 'user_test_1',
          participantName: 'Rahul Verma',
          participantEmail: 'rahul@example.com',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.registration.participantId).toBe('user_test_1');
      expect(res.body.data.competition.participantCount).toBe(1);
      expect(res.body.data.competition.spotsRemaining).toBe(2);

      const dbReg = await Registration.findOne({
        competitionId: testCompId,
        participantId: 'user_test_1',
      });
      expect(dbReg).not.toBeNull();
      expect(dbReg?.status).toBe('confirmed');
    });

    // 2. Duplicate registration prevention
    it('2. should prevent duplicate registration for the same participant (409 Conflict)', async () => {
      await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_duplicate' });

      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_duplicate' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('DUPLICATE_REGISTRATION');

      const comp = await Competition.findById(testCompId);
      expect(comp?.participantCount).toBe(1);
    });

    // 3. Registration when capacity is full
    it('3. should reject registration when competition is full (409 Conflict)', async () => {
      await request(app).post(`/api/competitions/${testCompId}/register`).send({ participantId: 'user_1' });
      await request(app).post(`/api/competitions/${testCompId}/register`).send({ participantId: 'user_2' });
      await request(app).post(`/api/competitions/${testCompId}/register`).send({ participantId: 'user_3' });

      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_overflow' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('COMPETITION_FULL');

      const comp = await Competition.findById(testCompId);
      expect(comp?.participantCount).toBe(3);
    });

    // 4 & 5. Multiple concurrent registrations & more requests than available spots
    it('4 & 5. should strictly prevent overbooking when 10 concurrent requests compete for 2 spots', async () => {
      const now = new Date();
      const tightComp = await Competition.create({
        title: 'High Concurrency Race Test',
        slug: `race-test-${Date.now()}`,
        category: 'Dance',
        prizePool: 500,
        entryFee: 50,
        capacity: 2,
        participantCount: 0,
        registrationStartAt: new Date(now.getTime() - 86400 * 1000),
        registrationEndAt: new Date(now.getTime() + 86400 * 1000),
        submissionStartAt: new Date(now.getTime() + 86400 * 1000),
        submissionEndAt: new Date(now.getTime() + 2 * 86400 * 1000),
        resultDate: new Date(now.getTime() + 3 * 86400 * 1000),
        judge: {
          name: 'Judge',
          role: 'Judge',
          designation: 'Judge',
          experience: '5y',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        aboutDescription: 'Test race condition',
        status: 'published',
      });

      const concurrentRequests = Array.from({ length: 10 }, (_, index) => {
        return request(app)
          .post(`/api/competitions/${tightComp._id}/register`)
          .send({
            participantId: `concurrent_user_${index}`,
            participantName: `Concurrent User ${index}`,
          });
      });

      const responses = await Promise.all(concurrentRequests);

      const successful = responses.filter((r) => r.status === 201);
      const failed = responses.filter((r) => r.status === 409 || r.status === 400);

      expect(successful.length).toBe(2);
      expect(failed.length).toBe(8);

      const finalComp = await Competition.findById(tightComp._id);
      expect(finalComp?.participantCount).toBe(2);

      const totalRegistrations = await Registration.countDocuments({
        competitionId: tightComp._id,
      });
      expect(totalRegistrations).toBe(2);

      await Competition.findByIdAndDelete(tightComp._id);
      await Registration.deleteMany({ competitionId: tightComp._id });
    });

    // 6. Database failure / rollback simulation
    it('6. should compensate and roll back participantCount if registration insert fails', async () => {
      // Artificially trigger an insert failure by pre-inserting the exact same participant directly in DB
      await Registration.create({
        competitionId: new mongoose.Types.ObjectId(testCompId),
        participantId: 'user_rollback_test',
        paymentDetails: { transactionId: 'tx_pre', amount: 99, currency: 'INR', status: 'paid' },
      });

      const initialCount = (await Competition.findById(testCompId))?.participantCount || 0;

      // Attempt registration through API - will hit compound unique index violation code 11000
      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_rollback_test' });

      expect(res.status).toBe(409);

      // Verify that participantCount was rolled back and did NOT permanently increment
      const afterCount = (await Competition.findById(testCompId))?.participantCount;
      expect(afterCount).toBe(initialCount);
    });

    // 7. Invalid competition ID
    it('7. should return 400 for a malformed competition ID format', async () => {
      const res = await request(app)
        .post('/api/competitions/not-a-valid-id/register')
        .send({ participantId: 'user_valid_1' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_COMPETITION_ID');
    });

    // 8. Invalid participant ID
    it('8. should return 400 when participantId is missing or empty', async () => {
      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantName: 'Missing ID User' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('MISSING_PARTICIPANT_ID');
    });

    // 9. Registration after the deadline
    it('9. should reject registration if registration deadline has passed (400 Bad Request)', async () => {
      await Competition.findByIdAndUpdate(testCompId, {
        registrationEndAt: new Date(Date.now() - 3600 * 1000),
      });

      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_late' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('REGISTRATION_CLOSED');
    });

    // 10. Registration before registration opens
    it('10. should reject registration if registration window has not opened yet', async () => {
      await Competition.findByIdAndUpdate(testCompId, {
        registrationStartAt: new Date(Date.now() + 86400 * 1000), // opens tomorrow
      });

      const res = await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_early' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('REGISTRATION_NOT_STARTED');
    });
  });

  describe('Section 6: Server-Authoritative Lifecycle Engine Boundary Tests', () => {
    it('should calculate "upcoming" when current time is before registrationStartAt', () => {
      const now = new Date('2026-08-01T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-15T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 0,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('upcoming');

      const eligibility = calculateRegistrationEligibility(compData, false, now);
      expect(eligibility.canRegister).toBe(false);
      expect(eligibility.isNotStartedYet).toBe(true);
    });

    it('should calculate "registration_open" when inside registration window and spots remain', () => {
      const now = new Date('2026-08-10T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-15T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 1,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('registration_open');

      const eligibility = calculateRegistrationEligibility(compData, false, now);
      expect(eligibility.canRegister).toBe(true);
      expect(eligibility.spotsRemaining).toBe(19);
    });

    it('should calculate "registration_closed" when deadline has passed or capacity is full', () => {
      const now = new Date('2026-08-16T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-20T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 5,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('registration_closed');

      const eligibility = calculateRegistrationEligibility(compData, false, now);
      expect(eligibility.canRegister).toBe(false);
      expect(eligibility.isDeadlinePassed).toBe(true);
    });

    it('should calculate "submission_open" when inside submission window', () => {
      const now = new Date('2026-08-22T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-20T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 20,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('submission_open');
    });

    it('should calculate "judging" when submission ended and awaiting resultDate', () => {
      const now = new Date('2026-08-27T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-20T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 20,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('judging');
    });

    it('should calculate "completed" after resultDate', () => {
      const now = new Date('2026-09-01T10:00:00Z');
      const compData = {
        registrationStartAt: new Date('2026-08-05T00:00:00Z'),
        registrationEndAt: new Date('2026-08-15T00:00:00Z'),
        submissionStartAt: new Date('2026-08-20T00:00:00Z'),
        submissionEndAt: new Date('2026-08-25T00:00:00Z'),
        resultDate: new Date('2026-08-30T00:00:00Z'),
        capacity: 20,
        participantCount: 20,
        status: 'published' as const,
      };

      const status = calculateLifecycleStatus(compData, now);
      expect(status).toBe('completed');
    });
  });

  describe('Section 7: General API Endpoints', () => {
    it('GET /api/health should return 200 with service health info', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('healthy');
    });

    it('GET /api/competitions should return list of active competitions', async () => {
      const res = await request(app).get('/api/competitions');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/competitions/:id/registration-status should return 200 for registered participant', async () => {
      await request(app)
        .post(`/api/competitions/${testCompId}/register`)
        .send({ participantId: 'user_status_check' });

      const res = await request(app)
        .get(`/api/competitions/${testCompId}/registration-status?participantId=user_status_check`);

      expect(res.status).toBe(200);
      expect(res.body.data.isRegistered).toBe(true);
      expect(res.body.data.registration.participantId).toBe('user_status_check');
    });

    it('GET /api/competitions/:id/registration-status should return isRegistered: false for unregistered', async () => {
      const res = await request(app)
        .get(`/api/competitions/${testCompId}/registration-status?participantId=user_unknown`);

      expect(res.status).toBe(200);
      expect(res.body.data.isRegistered).toBe(false);
      expect(res.body.data.registration).toBeNull();
    });
  });
});
