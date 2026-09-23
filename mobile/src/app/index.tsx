import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { api, CURRENT_PARTICIPANT_ID, CURRENT_PARTICIPANT_NAME } from '../services/api';
import { Competition } from '../types/competition';

import { HeaderNav } from '../components/competition/HeaderNav';
import { HeroDetailsCard } from '../components/competition/HeroDetailsCard';
import { JudgeCard } from '../components/competition/JudgeCard';
import { CountdownBanner } from '../components/competition/CountdownBanner';
import { ImportantDatesCard } from '../components/competition/ImportantDatesCard';
import { PreviousWinnersSection } from '../components/competition/PreviousWinnersSection';
import { TabsSection } from '../components/competition/TabsSection';
import { RewardsList } from '../components/competition/RewardsList';
import { TrustAndReferralSection } from '../components/competition/TrustAndReferralSection';
import { BottomStickyBar } from '../components/competition/BottomStickyBar';
import { BottomNavBar } from '../components/competition/BottomNavBar';

import { ProfileScreen } from '../components/screens/ProfileScreen';
import { ExploreScreen } from '../components/screens/ExploreScreen';
import { HomeScreen } from '../components/screens/HomeScreen';
import { CreateScreen } from '../components/screens/CreateScreen';

export default function AppEntryScreen() {
  const insets = useSafeAreaInsets();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ENG' | 'HIN'>('ENG');

  // Active page state: 'Competitions' (default target screen), 'Explore', 'Profile', 'Home'
  const [activeTab, setActiveTab] = useState('Competitions');
  const [previousTab, setPreviousTab] = useState('Home');

  // Inline video & submission states (no annoying modals)
  const [showSubmissionSheet, setShowSubmissionSheet] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string | null>(null);

  // Floating Toast banner for feedback (success, error, warning, info)
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const showToast = (
    msg: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch competition details from backend API
  const fetchCompetitionData = useCallback(async () => {
    try {
      setErrorMessage(null);
      const data = await api.getCompetition('feedants-classical-dance', CURRENT_PARTICIPANT_ID);
      setCompetition(data);
      setIsRegistered(data.isUserRegistered);
    } catch (err: any) {
      console.warn('Competition fetch notice:', err.message);
      setErrorMessage(err.message || 'Failed to load competition details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitionData();
  }, [fetchCompetitionData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCompetitionData();
  }, [fetchCompetitionData]);

  // High-concurrency registration action (direct, frictionless Play Store experience)
  const handleRegisterAction = async () => {
    if (!competition) return;

    if (isRegistered) {
      setActiveTab('Create');
      return;
    }

    if (!competition.eligibility?.canRegister) {
      showToast(competition.eligibility?.reason || 'Registration is currently closed.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.registerParticipant(competition._id, {
        participantId: CURRENT_PARTICIPANT_ID,
        participantName: CURRENT_PARTICIPANT_NAME,
      });

      setIsRegistered(true);
      if (response?.competition) {
        setCompetition((prev) =>
          prev
            ? {
                ...prev,
                participantCount: response.competition.participantCount,
                eligibility: {
                  ...prev.eligibility,
                  spotsRemaining: response.competition.spotsRemaining,
                  canRegister: false,
                  reason: 'You are registered',
                },
                isUserRegistered: true,
              }
            : null
        );
      }

      showToast('Registration Confirmed! 🎉 1 Spot Booked.', 'success');
    } catch (err: any) {
      console.warn('Registration result:', err.message);
      if (err.code === 'DUPLICATE_REGISTRATION' || err.status === 409) {
        setIsRegistered(true);
        showToast('You are already registered for this competition.', 'info');
      } else {
        showToast(err.message || 'Registration failed. Please try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tabName: string) => {
    setPreviousTab(activeTab);
    setActiveTab(tabName);
  };

  const handleGoBack = () => {
    if (activeTab === 'Competitions') {
      setActiveTab('Home');
    } else {
      setActiveTab('Competitions');
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#008080" />
        <Text style={styles.loadingText}>Loading Competition Details...</Text>
      </SafeAreaView>
    );
  }

  if (!competition) {
    return (
      <SafeAreaView style={styles.centerContainer} edges={['top', 'bottom']}>
        <Ionicons name="cloud-offline-outline" size={54} color="#94A3B8" />
        <Text style={styles.errorTitle}>Unable to Load Competition</Text>
        <Text style={styles.errorSubtitle}>
          {errorMessage || 'Please check your connection and tap Retry.'}
        </Text>
        <Pressable style={styles.retryButton} onPress={fetchCompetitionData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleTestDuplicateRegistration = async () => {
    if (!competition) return;
    try {
      showToast('Calling register API for existing user...');
      await api.registerParticipant(competition._id, {
        participantId: CURRENT_PARTICIPANT_ID,
        participantName: CURRENT_PARTICIPANT_NAME,
      });
    } catch (err: any) {
      showToast(`⚠️ Server Response (409): ${err.message}`);
    }
  };

  const handleSwitchToFreshUser = () => {
    setIsRegistered(false);
    showToast('Switched to Fresh User mode! Go to Competitions and tap Register Now.');
    setActiveTab('Competitions');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Floating Modern Toast Notification */}
      {toast && (
        <View
          style={[
            styles.toastBanner,
            toast.type === 'error'
              ? styles.toastError
              : toast.type === 'warning'
              ? styles.toastWarning
              : toast.type === 'info'
              ? styles.toastInfo
              : styles.toastSuccess,
          ]}
        >
          <Ionicons
            name={
              toast.type === 'error'
                ? 'alert-circle'
                : toast.type === 'warning'
                ? 'warning'
                : toast.type === 'info'
                ? 'information-circle'
                : 'checkmark-circle'
            }
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toastText}>{toast.message}</Text>
          <Pressable onPress={() => setToast(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* PAGE 1: Competition Details Screen (Objective_Page.png) */}
      {activeTab === 'Competitions' && (
        <View style={styles.pageContainer}>
          {/* Top Header Nav */}
          <HeaderNav
            language={language}
            onToggleLanguage={(lang) => {
              setLanguage(lang);
              showToast(`Language switched to ${lang === 'ENG' ? 'English' : 'हिंदी'}`);
            }}
            onBack={handleGoBack}
          />

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0D9488']}
                tintColor="#0D9488"
              />
            }
          >
            {/* Title, Badge, Price, Spots Progress */}
            <HeroDetailsCard
              competition={competition}
              isRegistered={isRegistered}
            />

            {/* Judge Card */}
            {competition.judge && (
              <JudgeCard
                judge={competition.judge}
                onPlayIntro={() => {
                  setActiveVideoTitle(`Intro by ${competition.judge.name}`);
                  showToast(`Playing intro by Judge ${competition.judge.name}`);
                }}
              />
            )}

            {/* Dynamic Countdown Banner (single line, zero overlap) */}
            <CountdownBanner
              initialSecondsRemaining={competition.countdown?.seconds}
              deadlineIso={competition.registrationEndAt}
            />

            {/* Important Dates 2x2 Grid */}
            <ImportantDatesCard competition={competition} />

            {/* Previous Winners Horizontal Carousel */}
            {competition.previousWinners && competition.previousWinners.length > 0 ? (
              <PreviousWinnersSection
                winners={competition.previousWinners}
                onWatchWinner={(winner) => {
                  setActiveVideoTitle(`${winner.name} (${winner.rankTitle}) Performance`);
                  showToast(`Playing dance performance by ${winner.name}`);
                }}
              />
            ) : null}

            {/* Interactive Tabs (About, Judging, Rules) */}
            <TabsSection competition={competition} />

            {/* Rewards Breakdown with Vector Icons (Trophies, Medals) */}
            {competition.rewards && competition.rewards.length > 0 ? (
              <RewardsList
                rewards={competition.rewards}
                currency={competition.currency}
              />
            ) : null}

            {/* Disclaimer, Trust, Referral & User Feedback */}
            <TrustAndReferralSection
              competition={competition}
              onOpenVideo={(title) => {
                setActiveVideoTitle(title);
                showToast(`Opening intro video: "${title}"`);
              }}
              onOpenPolicy={() =>
                showToast('Refund Policy: 100% money back before registration deadline.')
              }
              onOpenTestimonials={() =>
                showToast('Verified: 4.9★ rating by 2,400+ classical artists.')
              }
            />
          </ScrollView>

          {/* Inline Video Player Bar (if user played a video) */}
          {activeVideoTitle && (
            <View style={styles.inlineVideoBar}>
              <Ionicons name="play-circle" size={24} color="#0D9488" />
              <View style={{ flex: 1 }}>
                <Text style={styles.inlineVideoTitle} numberOfLines={1}>
                  {activeVideoTitle}
                </Text>
                <Text style={styles.inlineVideoSub}>Playing 01:15 / 03:00</Text>
              </View>
              <Pressable onPress={() => setActiveVideoTitle(null)}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </Pressable>
            </View>
          )}

          {/* Inline Submission Drawer / Card (when registered user clicks upload) */}
          {showSubmissionSheet && (
            <View style={styles.submissionDrawer}>
              <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>Submit Video Entry</Text>
                <Pressable onPress={() => setShowSubmissionSheet(false)}>
                  <Ionicons name="close" size={20} color="#0F172A" />
                </Pressable>
              </View>
              <Text style={styles.drawerDesc}>
                Provide YouTube or Google Drive link for your 3-minute Kathak solo.
              </Text>
              <View style={styles.drawerInputRow}>
                <TextInput
                  style={styles.drawerInput}
                  placeholder="https://youtu.be/..."
                  placeholderTextColor="#94A3B8"
                  value={submissionUrl}
                  onChangeText={setSubmissionUrl}
                />
                <Pressable
                  style={styles.drawerSubmitBtn}
                  onPress={() => {
                    setShowSubmissionSheet(false);
                    setSubmissionUrl('');
                    showToast('Submission received! Best of luck for the results.');
                  }}
                >
                  <Text style={styles.drawerSubmitText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Sticky Primary Action CTA Bar */}
          <BottomStickyBar
            competition={competition}
            isRegistered={isRegistered}
            isSubmitting={isSubmitting}
            onPressAction={handleRegisterAction}
          />
        </View>
      )}

      {/* PAGE 2: Explore Screen */}
      {activeTab === 'Explore' && (
        <ExploreScreen
          competition={competition}
          onSelectCompetition={() => setActiveTab('Competitions')}
          onBack={handleGoBack}
        />
      )}

      {/* PAGE 3: Profile Screen */}
      {activeTab === 'Profile' && (
        <ProfileScreen
          isRegistered={isRegistered}
          onOpenCompetition={() => setActiveTab('Competitions')}
          onBack={handleGoBack}
          onTestDuplicateRegistration={handleTestDuplicateRegistration}
          onSwitchToFreshUser={handleSwitchToFreshUser}
        />
      )}

      {/* PAGE 4: Home Screen */}
      {activeTab === 'Home' && (
        <HomeScreen
          competition={competition}
          onOpenCompetition={() => setActiveTab('Competitions')}
        />
      )}

      {/* PAGE 5: Create / Submit Screen */}
      {activeTab === 'Create' && (
        <CreateScreen
          competition={competition}
          isRegistered={isRegistered}
          onBack={handleGoBack}
          onRegister={handleRegisterAction}
          onSubmitSuccess={(msg) => {
            showToast(msg, 'success');
            setActiveTab('Competitions');
          }}
        />
      )}

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onTabPress={handleTabChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pageContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
    maxWidth: 280,
  },
  retryButton: {
    backgroundColor: '#006666',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  toastBanner: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
    justifyContent: 'space-between',
    zIndex: 9999,
    ...Platform.select({
      web: {
        boxShadow: '0 3px 6px rgba(0,0,0,0.18)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  },
  toastSuccess: {
    backgroundColor: '#006666',
  },
  toastError: {
    backgroundColor: '#DC2626',
  },
  toastWarning: {
    backgroundColor: '#D97706',
  },
  toastInfo: {
    backgroundColor: '#2563EB',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    lineHeight: 18,
  },
  inlineVideoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderTopWidth: 1,
    borderTopColor: '#99F6E4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  inlineVideoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  inlineVideoSub: {
    fontSize: 11,
    color: '#64748B',
  },
  submissionDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    padding: 16,
    gap: 8,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  drawerDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  drawerInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  drawerInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    fontSize: 12,
    color: '#0F172A',
  },
  drawerSubmitBtn: {
    backgroundColor: '#006666',
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});