import { Competition } from '../models/competition.model';
import { Registration } from '../models/registration.model';

export const seedDatabase = async () => {
  try {
    const existing = await Competition.findOne({ slug: 'feedants-classical-dance' });
    if (existing) {
      console.log('Seed competition already exists:', existing._id.toString());
      return existing;
    }

    const now = new Date();
    // Set countdown to ~1 day 6 hours 28 mins 32 secs from now so the countdown banner matches the reference!
    const registrationEndAt = new Date(now.getTime() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000);
    const registrationStartAt = new Date(now.getTime() - 4 * 86400 * 1000);
    const submissionStartAt = new Date(now.getTime() - 2 * 86400 * 1000);
    const submissionEndAt = new Date(registrationEndAt.getTime() + 15 * 86400 * 1000);
    const resultDate = new Date(submissionEndAt.getTime() + 5 * 86400 * 1000);

    const competition = await Competition.create({
      title: 'Feedants Classical Dance',
      slug: 'feedants-classical-dance',
      category: 'Dance',
      tags: ['Dance', 'Multi-Win'],
      badge: 'Winners get certificate',
      prizePool: 1500,
      entryFee: 99,
      currency: '₹',
      capacity: 20,
      participantCount: 1, // Exactly matches "1 / 20 Booked", "Only 19 spots left"
      registrationStartAt,
      registrationEndAt,
      submissionStartAt,
      submissionEndAt,
      resultDate,
      judge: {
        name: 'Manju Dubey',
        role: 'Judge',
        designation: 'Professional Kathak Dancer',
        experience: '12+ Years of Experience',
        avatarUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        introVideoUrl: 'https://feedants.com/video/judge-intro',
      },
      previousWinners: [
        {
          name: 'Riya Shah',
          rankTitle: '1st Winner',
          videoThumbnail:
            'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://feedants.com/video/riya',
        },
        {
          name: 'Aarav Mehta',
          rankTitle: '1st Winner',
          videoThumbnail:
            'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://feedants.com/video/aarav',
        },
        {
          name: 'Neha Verma',
          rankTitle: '2nd Winner',
          videoThumbnail:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://feedants.com/video/neha',
        },
        {
          name: 'Ishita Chouhan',
          rankTitle: '3rd Winner',
          videoThumbnail:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          videoUrl: 'https://feedants.com/video/ishita',
        },
      ],
      rewards: [
        { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy' },
        { rank: 2, title: '2nd Winner', amount: 300, icon: 'medal-silver' },
        { rank: 3, title: '3rd Winner', amount: 240, icon: 'medal-bronze' },
        { rank: 4, title: '4th Winner', amount: 200, icon: 'star' },
        { rank: 5, title: '5th Winner', amount: 130, icon: 'star' },
        { rank: 6, title: '6th Winner', amount: 80, icon: 'star' },
      ],
      judgingParameters: [
        {
          name: 'Rhythm & Taal Precision',
          weightage: 30,
          description: 'Mastery over laya, footwork (tatkar), and sync with the beat.',
        },
        {
          name: 'Abhinaya & Expressions',
          weightage: 30,
          description: 'Facial expressions (bhav), eye movements, and storytelling clarity.',
        },
        {
          name: 'Anga Shuddhi & Posture',
          weightage: 20,
          description: 'Body lines, hand gestures (mudras), and classical grace.',
        },
        {
          name: 'Presentation & Attire',
          weightage: 20,
          description: 'Traditional Kathak costume, ghungroo sound clarity, and overall stage presence.',
        },
      ],
      aboutDescription:
        'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
      rules: [
        'Only solo classical dance performances are eligible (Kathak, Bharatanatyam, Odissi, Kuchipudi, etc.).',
        'Video submissions must be between 1.5 and 4 minutes in duration.',
        'Continuous single-take recording without video edits or digital effects is mandatory.',
        'Ensure proper lighting and clear audio of both music and ghungroos.',
        'One registration per participant. Duplicate registrations will be automatically rejected.',
        'Decisions of the judge Manju Dubey and the jury are final and binding.',
      ],
      referralLink: 'https://feedants.com/r/referral123',
      referralRewardText: 'You earn ₹10 for every signup',
      status: 'published',
    });

    // Seed the 1 confirmed registration so 1/20 is legitimately recorded!
    await Registration.create({
      competitionId: competition._id,
      participantId: 'user_seeded_1',
      participantName: 'Aditi Sharma',
      participantEmail: 'aditi.sharma@example.com',
      status: 'confirmed',
      paymentDetails: {
        transactionId: 'tx_seed_101',
        amount: 99,
        currency: 'INR',
        status: 'paid',
      },
    });

    console.log('Seeded competition successfully with ID:', competition._id.toString());
    return competition;
  } catch (err: any) {
    console.error('Error during database seeding:', err.message);
    throw err;
  }
};
