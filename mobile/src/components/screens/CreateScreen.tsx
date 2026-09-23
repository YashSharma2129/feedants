import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface CreateScreenProps {
  competition: Competition;
  isRegistered: boolean;
  onBack: () => void;
  onSubmitSuccess?: (message: string) => void;
  onRegister?: () => Promise<void>;
}

import { api } from '../../services/api';

export const CreateScreen: React.FC<CreateScreenProps> = ({
  competition,
  isRegistered,
  onBack,
  onSubmitSuccess,
  onRegister,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [performanceTitle, setPerformanceTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async () => {
    if (!videoUrl.trim()) {
      showToast('Please enter a valid YouTube or Google Drive video link.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitVideoEntry(competition._id, {
        mediaUrl: videoUrl.trim(),
        notes: `${performanceTitle ? performanceTitle + ' - ' : ''}${notes}`.trim(),
      });
      setIsSubmitted(true);
      showToast('Video entry saved in database! 🌟 Best of luck!', 'success');
      if (onSubmitSuccess) {
        onSubmitSuccess('Video entry saved in database! 🌟 Best of luck!');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit entry. Please ensure you are registered.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Nav */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
          <Text style={styles.headerTitle}>Create & Submit</Text>
        </Pressable>
      </View>

      {/* In-App Toast Notification Banner */}
      {toast && (
        <View
          style={[
            styles.toastBanner,
            toast.type === 'error'
              ? styles.toastError
              : toast.type === 'success'
              ? styles.toastSuccess
              : styles.toastInfo,
          ]}
        >
          <Ionicons
            name={
              toast.type === 'error'
                ? 'alert-circle'
                : toast.type === 'success'
                ? 'checkmark-circle'
                : 'information-circle'
            }
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.toastText}>{toast.message}</Text>
          <Pressable onPress={() => setToast(null)}>
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Primary Action: Submit Competition Entry */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-upload" size={18} color="#008080" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Submit Video Entry</Text>
                <Text style={styles.cardSubtitle}>
                  {competition.title || 'Feedants Classical Dance'}
                </Text>
              </View>
            </View>
            <View style={[styles.statusPill, isRegistered ? styles.statusPillRegistered : styles.statusPillOpen]}>
              <Text style={[styles.statusPillText, isRegistered ? styles.statusPillTextReg : styles.statusPillTextOpen]}>
                {isRegistered ? '✓ Registered' : 'Open Entry'}
              </Text>
            </View>
          </View>

          {!isRegistered ? (
            <View style={styles.notRegBox}>
              <Ionicons name="lock-closed" size={38} color="#D97706" />
              <Text style={styles.notRegTitle}>Registration Required</Text>
              <Text style={styles.notRegDesc}>
                You must be registered for "{competition.title}" before submitting your video entry.
              </Text>
              <Pressable
                style={[styles.registerFirstBtn, isRegistering && { opacity: 0.7 }]}
                disabled={isRegistering}
                onPress={async () => {
                  if (onRegister) {
                    setIsRegistering(true);
                    try {
                      await onRegister();
                      showToast('Successfully registered! You can now submit your video.', 'success');
                    } catch (err: any) {
                      showToast(err.message || 'Registration failed.', 'error');
                    } finally {
                      setIsRegistering(false);
                    }
                  } else {
                    onBack();
                  }
                }}
              >
                {isRegistering ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="ticket" size={16} color="#FFFFFF" />
                    <Text style={styles.registerFirstBtnText}>
                      Register Now - {competition.currency} {competition.entryFee}
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          ) : isSubmitted ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={44} color="#0D9488" />
              <Text style={styles.successTitle}>Entry Submitted!</Text>
              <Text style={styles.successDesc}>
                Your performance video has been uploaded for {competition.judge?.name || 'Judge Manju Dubey'} to review. Results will be announced on 1 Sept 2026.
              </Text>
              <Pressable
                style={styles.backToCompBtn}
                onPress={onBack}
              >
                <Text style={styles.backToCompText}>Back to Competition</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Performance Video Link *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://youtu.be/... or Google Drive link"
                placeholderTextColor="#94A3B8"
                value={videoUrl}
                onChangeText={setVideoUrl}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Dance Item / Song Title (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kathak Tarana in Teentaal"
                placeholderTextColor="#94A3B8"
                value={performanceTitle}
                onChangeText={setPerformanceTitle}
              />

              <Text style={styles.label}>Message for Judges (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add any notes about your costume, gharana, or guru..."
                placeholderTextColor="#94A3B8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              <View style={styles.guidelineBox}>
                <Ionicons name="information-circle-outline" size={16} color="#0D9488" />
                <Text style={styles.guidelineText}>
                  Video must be 3–5 minutes long, with clear audio and full body framing.
                </Text>
              </View>

              <Pressable
                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Submit Video for Judging</Text>
                  </>
                )}
              </Pressable>
            </View>
          )}
        </View>

        {/* 2. Secondary Action: Host Competition */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <FontAwesome5 name="trophy" size={16} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Host a Competition</Text>
              <Text style={styles.cardSubtitle}>
                Are you an academy, dancer, or brand? Host your own talent challenge.
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => showToast('Host Competition portal will open shortly. Contact support@feedants.com for academy partnerships!', 'info')}
          >
            <Text style={styles.secondaryBtnText}>Create Competition</Text>
            <Ionicons name="arrow-forward" size={15} color="#008080" />
          </Pressable>
        </View>

        {/* 3. Secondary Action: Share Practice Clip */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
              <MaterialCommunityIcons name="video-plus" size={18} color="#7E22CE" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Post Rehearsal Clip</Text>
              <Text style={styles.cardSubtitle}>
                Share short rehearsal clips to the Feedants artist community for feedback.
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.secondaryBtn}
            onPress={() => showToast('Community feed upload will be active during submission phase.', 'info')}
          >
            <Text style={styles.secondaryBtnText}>Upload Rehearsal Video</Text>
            <Ionicons name="arrow-forward" size={15} color="#008080" />
          </Pressable>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
  },
  toastError: {
    backgroundColor: '#DC2626',
  },
  toastSuccess: {
    backgroundColor: '#059669',
  },
  toastInfo: {
    backgroundColor: '#0284C7',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    lineHeight: 17,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillRegistered: {
    backgroundColor: '#DCFCE7',
  },
  statusPillOpen: {
    backgroundColor: '#F1F5F9',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextReg: {
    color: '#15803D',
  },
  statusPillTextOpen: {
    color: '#475569',
  },
  formContainer: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  guidelineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginTop: 4,
  },
  guidelineText: {
    fontSize: 11,
    color: '#0D9488',
    flex: 1,
    lineHeight: 15,
  },
  submitBtn: {
    backgroundColor: '#006666',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  successDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  backToCompBtn: {
    marginTop: 8,
    backgroundColor: '#006666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backToCompText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#006666',
  },
  notRegBox: {
    alignItems: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  notRegTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
  },
  notRegDesc: {
    fontSize: 12,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  registerFirstBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#006666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  registerFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
