import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface TrustAndReferralSectionProps {
  competition: Competition;
  onOpenVideo?: (title: string, videoUrl?: string) => void;
  onOpenPolicy?: () => void;
  onOpenTestimonials?: () => void;
}

export const TrustAndReferralSection: React.FC<TrustAndReferralSectionProps> = ({
  competition,
  onOpenVideo,
  onOpenPolicy,
  onOpenTestimonials,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <View style={styles.container}>
      {/* 1. Disclaimer Banner */}
      <View style={styles.disclaimerCard}>
        <Ionicons
          name="information-circle-outline"
          size={18}
          color="#0D9488"
          style={styles.disclaimerIcon}
        />
        <Text style={styles.disclaimerText}>
          <Text style={styles.disclaimerBold}>Disclaimer: </Text>
          Only contributions from paid participants will be considered for judging.
        </Text>
      </View>

      {/* 2. Trust & FAQs Row */}
      <View style={styles.trustRow}>
        {/* Left: How will you receive prize money? */}
        <Pressable
          style={styles.trustCard}
          onPress={() =>
            onOpenVideo
              ? onOpenVideo(
                  'How will you receive prize money?',
                  'https://feedants.com/video/prize-info'
                )
              : null
          }
        >
          <View style={styles.playSquare}>
            <Ionicons name="play" size={16} color="#006666" style={{ marginLeft: 2 }} />
          </View>
          <View style={styles.trustTextCol}>
            <Text style={styles.trustCardTitle}>How will you receive prize money?</Text>
            <Text style={styles.trustCardSubtitle}>Watch video to know more</Text>
          </View>
        </Pressable>

        {/* Right: Refund policy & Razorpay */}
        <View style={styles.trustCard}>
          <Pressable
            style={styles.trustInnerItem}
            onPress={() => (onOpenPolicy ? onOpenPolicy() : null)}
          >
            <Ionicons name="shield-checkmark-outline" size={16} color="#0D9488" />
            <Text style={styles.trustInnerLabel}>Refund policy</Text>
          </Pressable>

          <View style={[styles.trustInnerItem, { marginTop: 6 }]}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#0D9488" />
            <View style={{ flex: 1 }}>
              <Text style={styles.secureText}>Secure payments powered by</Text>
              <Text style={styles.razorpayText}>Razorpay</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Refer & Earn Banner (Exact layout matching Objective_Page.png with zero overlap) */}
      <View style={styles.referralBanner}>
        <View style={styles.referralHeaderRow}>
          {/* Megaphone icon + text */}
          <View style={styles.referralTitleRow}>
            <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#0D9488" />
            <Text style={styles.referralTitle} numberOfLines={1}>
              Refer & Earn more discount
            </Text>
          </View>

          {/* Refer Now Button with subtitle */}
          <View style={styles.referralButtonCol}>
            <Pressable
              style={styles.referNowButton}
              onPress={handleCopyLink}
            >
              <Text style={styles.referNowText}>Refer Now</Text>
            </Pressable>
            <Text style={styles.referRewardText} numberOfLines={1}>
              You earn <Text style={{ fontWeight: '800' }}>₹10</Text> for every signup
            </Text>
          </View>
        </View>

        {/* Full width referral link pill input */}
        <View style={styles.linkRow}>
          <View style={styles.linkContainer}>
            <Text style={styles.referralUrl} numberOfLines={1} ellipsizeMode="middle">
              {competition.referralLink || 'https://feedants.com/r/referral123'}
            </Text>
            <Pressable
              style={[styles.copyButton, copied && styles.copyButtonActive]}
              onPress={handleCopyLink}
            >
              <Text style={[styles.copyButtonText, copied && styles.copyButtonTextActive]}>
                {copied ? 'Copied!' : 'Copy Link'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* 4. Hear From Our Users */}
      <Pressable
        style={styles.testimonialsCard}
        onPress={() => (onOpenTestimonials ? onOpenTestimonials() : null)}
      >
        <View style={styles.testimonialLeft}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#0F172A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.testimonialTitle}>Hear From Our Users</Text>
            <Text style={styles.testimonialSubtitle} numberOfLines={1}>
              See what participants say about Feedants
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
      </Pressable>

      {/* 5. Ad Here Box */}
      <View style={styles.adBox}>
        <MaterialCommunityIcons name="bullhorn-outline" size={16} color="#94A3B8" />
        <Text style={styles.adText}>Ad Here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  disclaimerIcon: {
    marginTop: 1,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#334155',
    flex: 1,
  },
  disclaimerBold: {
    fontWeight: '700',
    color: '#0F766E',
  },
  trustRow: {
    flexDirection: 'row',
    gap: 10,
  },
  trustCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    minHeight: 80,
  },
  playSquare: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  trustTextCol: {
    justifyContent: 'center',
  },
  trustCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 14,
  },
  trustCardSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  trustInnerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  trustInnerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  secureText: {
    fontSize: 10,
    color: '#64748B',
  },
  razorpayText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A2540',
    fontStyle: 'italic',
    letterSpacing: -0.2,
  },
  referralBanner: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  referralHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  referralTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  referralTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  referralButtonCol: {
    alignItems: 'center',
    flexShrink: 0,
  },
  referNowButton: {
    backgroundColor: '#006666',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  referNowText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  referRewardText: {
    fontSize: 9,
    color: '#047857',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '600',
  },
  linkRow: {
    width: '100%',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    overflow: 'hidden',
    height: 32,
  },
  referralUrl: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
    paddingHorizontal: 8,
  },
  copyButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#CBD5E1',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButtonActive: {
    backgroundColor: '#0D9488',
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  copyButtonTextActive: {
    color: '#FFFFFF',
  },
  testimonialsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  testimonialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  testimonialTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  testimonialSubtitle: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  adBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  adText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
