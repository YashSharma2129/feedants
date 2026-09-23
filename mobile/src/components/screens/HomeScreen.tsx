import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface HomeScreenProps {
  competition: Competition;
  onOpenCompetition: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  competition,
  onOpenCompetition,
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Sleek Brand Header */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Text style={styles.brandTitle}>feedants</Text>
          <View style={styles.brandDot} />
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={20} color="#0F172A" />
            <View style={styles.unreadDot} />
          </Pressable>
          <Image
            source={{
              uri:
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
            }}
            style={styles.headerAvatar}
          />
        </View>
      </View>

      {/* 2. Hero Event Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTopRow}>
          <View style={styles.categoryBadge}>
            <FontAwesome5 name="trophy" size={11} color="#CCFBF1" />
            <Text style={styles.categoryBadgeText}>FEATURED CHAMPIONSHIP</Text>
          </View>
          <View style={styles.liveChip}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveChipText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.heroTitle}>{competition.title}</Text>
        <Text style={styles.heroSubtitle}>
          India’s premier classical Kathak competition judged by veteran guru {competition.judge?.name}.
        </Text>

        {/* Highlight Metrics */}
        <View style={styles.heroMetrics}>
          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricLabel}>Total Prize</Text>
            <Text style={styles.heroMetricVal}>
              {competition.currency} {competition.prizePool?.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricLabel}>Entry Fee</Text>
            <Text style={styles.heroMetricVal}>
              {competition.currency} {competition.entryFee}
            </Text>
          </View>

          <View style={styles.heroMetricDivider} />

          <View style={styles.heroMetricItem}>
            <Text style={styles.heroMetricLabel}>Spots Left</Text>
            <Text style={styles.heroMetricVal}>
              {competition.eligibility?.spotsRemaining} / {competition.capacity}
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable style={styles.heroCtaButton} onPress={onOpenCompetition}>
          <Text style={styles.heroCtaText}>View Competition Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#004D40" />
        </Pressable>
      </View>

      {/* 3. Social Proof Stats Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.stripItem}>
          <Text style={styles.stripNumber}>2,400+</Text>
          <Text style={styles.stripLabel}>Artists Enrolled</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripItem}>
          <Text style={styles.stripNumber}>₹ 1.5L+</Text>
          <Text style={styles.stripLabel}>Prize Awarded</Text>
        </View>
        <View style={styles.stripDivider} />
        <View style={styles.stripItem}>
          <Text style={styles.stripNumber}>4.9 ★</Text>
          <Text style={styles.stripLabel}>Jury Rating</Text>
        </View>
      </View>

      {/* 4. Head Judge Spotlight */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>Judge In The Spotlight</Text>
        <Pressable style={styles.judgeCard} onPress={onOpenCompetition}>
          <Image
            source={{
              uri:
                competition.judge?.avatarUrl ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.judgeAvatar}
          />
          <View style={styles.judgeInfo}>
            <Text style={styles.judgeRole}>{competition.judge?.role}</Text>
            <Text style={styles.judgeName}>{competition.judge?.name}</Text>
            <Text style={styles.judgeDesignation}>{competition.judge?.designation}</Text>
            <Text style={styles.judgeExp}>{competition.judge?.experience}</Text>
          </View>
          <View style={styles.judgePlayCircle}>
            <Ionicons name="play" size={16} color="#0D9488" style={{ marginLeft: 2 }} />
          </View>
        </Pressable>
      </View>

      {/* 5. Hall of Fame / Previous Winners */}
      {competition.previousWinners?.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Hall of Fame Winners</Text>
            <Pressable onPress={onOpenCompetition}>
              <Text style={styles.viewAllText}>See all</Text>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.winnerScroll}>
            {competition.previousWinners.map((winner, idx) => (
              <Pressable key={idx} style={styles.winnerCard} onPress={onOpenCompetition}>
                <Image source={{ uri: winner.videoThumbnail }} style={styles.winnerThumb} />
                <View style={styles.winnerDetails}>
                  <Text style={styles.winnerName} numberOfLines={1}>{winner.name}</Text>
                  <Text style={styles.winnerRank}>{winner.rankTitle}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 6. Why Compete On Feedants */}
      <View style={[styles.sectionContainer, { marginBottom: 30 }]}>
        <Text style={styles.sectionHeader}>Why Artists Trust Feedants</Text>
        <View style={styles.reasonsGrid}>
          <View style={styles.reasonCard}>
            <MaterialCommunityIcons name="shield-check" size={24} color="#0D9488" />
            <Text style={styles.reasonTitle}>100% Fair Judging</Text>
            <Text style={styles.reasonDesc}>Independent scoring by veteran classical dance gurus.</Text>
          </View>
          <View style={styles.reasonCard}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#008080" />
            <Text style={styles.reasonTitle}>Instant UPI Payouts</Text>
            <Text style={styles.reasonDesc}>Direct cash prize transfer within 48h of results.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D9488',
    marginLeft: 3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
  },
  heroBanner: {
    margin: 16,
    backgroundColor: '#004D40',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#004D40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  categoryBadgeText: {
    color: '#CCFBF1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  liveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveChipText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#CCFBF1',
    lineHeight: 18,
    marginBottom: 14,
  },
  heroMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  heroMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroMetricLabel: {
    fontSize: 10,
    color: '#99F6E4',
    marginBottom: 2,
  },
  heroMetricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 8,
  },
  heroCtaText: {
    color: '#004D40',
    fontSize: 13,
    fontWeight: '800',
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stripItem: {
    flex: 1,
    alignItems: 'center',
  },
  stripNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  stripLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  stripDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  judgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  judgeAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E2E8F0',
  },
  judgeInfo: {
    flex: 1,
  },
  judgeRole: {
    fontSize: 11,
    color: '#64748B',
  },
  judgeName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  judgeDesignation: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  judgeExp: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
  },
  judgePlayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerScroll: {
    gap: 10,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    paddingRight: 14,
  },
  winnerThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  winnerDetails: {
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: 90,
  },
  winnerRank: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 1,
  },
  reasonsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  reasonCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  reasonTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  reasonDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
});
