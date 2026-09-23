import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CURRENT_PARTICIPANT_NAME, CURRENT_PARTICIPANT_ID } from '../../services/api';

interface ProfileScreenProps {
  isRegistered: boolean;
  participantId?: string;
  participantName?: string;
  onOpenCompetition: () => void;
  onBack: () => void;
  onTestDuplicateRegistration?: () => void;
  onSwitchToFreshUser?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  isRegistered,
  participantId = CURRENT_PARTICIPANT_ID,
  participantName = CURRENT_PARTICIPANT_NAME,
  onOpenCompetition,
  onBack,
  onTestDuplicateRegistration,
  onSwitchToFreshUser,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
          <Text style={styles.headerTitle}>My Profile</Text>
        </Pressable>
        <Ionicons name="settings-outline" size={20} color="#0F172A" />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{CURRENT_PARTICIPANT_NAME}</Text>
            <Text style={styles.userRole}>Kathak Solo Performer</Text>
            <Text style={styles.userId}>ID: {CURRENT_PARTICIPANT_ID}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{isRegistered ? '1' : '0'}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>₹ 250</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
        </View>

        {/* Enrolled Competitions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Enrolled Competitions</Text>

          {isRegistered ? (
            <Pressable style={styles.competitionCard} onPress={onOpenCompetition}>
              <View style={styles.compIconBox}>
                <Ionicons name="trophy" size={22} color="#0D9488" />
              </View>
              <View style={styles.compDetails}>
                <Text style={styles.compTitle}>Feedants Classical Dance</Text>
                <Text style={styles.compSubtitle}>Kathak Competition • Judge: Manju Dubey</Text>
                <View style={styles.registeredBadge}>
                  <Ionicons name="checkmark-circle" size={12} color="#0D9488" />
                  <Text style={styles.registeredBadgeText}>Confirmed & Registered</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </Pressable>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="ticket-outline" size={32} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No Active Registrations</Text>
              <Text style={styles.emptySubtitle}>
                You haven’t enrolled in any competition yet.
              </Text>
              <Pressable style={styles.browseBtn} onPress={onOpenCompetition}>
                <Text style={styles.browseBtnText}>Browse Feedants Classical Dance</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Assignment Verification Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Evaluator / Testing Tools</Text>
          <View style={styles.testingCard}>
            <Text style={styles.testingCardDesc}>
              Use these quick actions to verify assignment requirements:
            </Text>

            <Pressable
              style={styles.testActionBtn}
              onPress={onTestDuplicateRegistration}
            >
              <Ionicons name="alert-circle" size={20} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.testActionTitle}>Test Duplicate Registration (HTTP 409)</Text>
                <Text style={styles.testActionSub}>Fires API call for registered user to demonstrate 409 Conflict error toast</Text>
              </View>
            </Pressable>

            <Pressable
              style={[styles.testActionBtn, { backgroundColor: '#F0FDFA', borderColor: '#CCFBF1' }]}
              onPress={onSwitchToFreshUser}
            >
              <Ionicons name="person-add" size={20} color="#0D9488" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.testActionTitle, { color: '#006666' }]}>Test Fresh Registration</Text>
                <Text style={styles.testActionSub}>Switches to a new participant to test booking a new spot from scratch</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Quick Menu Options */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account & Preferences</Text>
          <View style={styles.menuContainer}>
            <View style={styles.menuItem}>
              <Ionicons name="receipt-outline" size={18} color="#0F172A" />
              <Text style={styles.menuLabel}>Payment History & Invoices</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
            <View style={styles.menuItem}>
              <Ionicons name="notifications-outline" size={18} color="#0F172A" />
              <Text style={styles.menuLabel}>Notifications & Reminders</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
            <View style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={18} color="#0F172A" />
              <Text style={styles.menuLabel}>Feedants Help & Support</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E2E8F0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 2,
  },
  userId: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#006666',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  competitionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  compIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compDetails: {
    flex: 1,
  },
  compTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  compSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  registeredBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  browseBtn: {
    backgroundColor: '#006666',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 6,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuLabel: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  testingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  testingCardDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  testActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  testActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  testActionSub: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 15,
  },
});
