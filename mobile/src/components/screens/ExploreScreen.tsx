import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface ExploreScreenProps {
  competition: Competition;
  onSelectCompetition: () => void;
  onBack: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  competition,
  onSelectCompetition,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Classical Dance', 'Kathak', 'Bharatanatyam', 'Vocal Music', 'Folk Dance'];

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
          <Text style={styles.headerTitle}>Explore Competitions</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search classical dance, judges, styles..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Compact Horizontal Category Filter Chips (FIXED: no vertical stretching!) */}
      <View style={styles.chipWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Competitions Feed */}
      <ScrollView style={styles.feedScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.feedHeader}>Featured Competitions</Text>
          <Text style={styles.resultsCount}>1 Live Event</Text>
        </View>

        {/* Main Featured Competition Card (Feedants Classical Dance) */}
        <Pressable style={styles.featuredCard} onPress={onSelectCompetition}>
          {/* Card Top Row: Live Status + Spots Left + Prize Pool */}
          <View style={styles.cardTopRow}>
            <View style={styles.badgeRow}>
              <View style={styles.liveBadge}>
                <View style={styles.livePulseDot} />
                <Text style={styles.liveBadgeText}>Registration Open</Text>
              </View>
              <Text style={styles.spotsLeftText}>
                {competition.eligibility?.spotsRemaining} spots left
              </Text>
            </View>

            <View style={styles.prizeBox}>
              <Text style={styles.prizeLabel}>Prize Pool</Text>
              <Text style={styles.prizeVal}>
                {competition.currency} {competition.prizePool?.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Title & Description */}
          <Text style={styles.cardTitle}>{competition.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {competition.aboutDescription}
          </Text>

          {/* Judge and Action Row */}
          <View style={styles.cardFooter}>
            <View style={styles.judgeRow}>
              <Image
                source={{
                  uri:
                    competition.judge?.avatarUrl ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
                }}
                style={styles.judgeAvatar}
              />
              <View>
                <Text style={styles.judgeName}>{competition.judge?.name}</Text>
                <Text style={styles.judgeRole}>Kathak Judge • 12+ Yrs Exp</Text>
              </View>
            </View>

            <View style={styles.actionCol}>
              <Text style={styles.entryFee}>
                Entry Fee: <Text style={styles.feeAmount}>{competition.currency} {competition.entryFee}</Text>
              </Text>
              <View style={styles.viewDetailsBtn}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </Pressable>

        {/* Upcoming Competition Card 2 */}
        <View style={styles.upcomingCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>Coming in Oct</Text>
            </View>
            <Text style={styles.upcomingGenre}>Bharatanatyam Solo</Text>
          </View>
          <Text style={styles.upcomingTitle}>National Natya Kala Championship</Text>
          <Text style={styles.upcomingDesc}>
            Pan-India classical Bharatanatyam presentation evaluated by veteran gurus.
          </Text>
          <View style={styles.upcomingFooter}>
            <Text style={styles.upcomingDate}>Registration opens 5 Oct 2026</Text>
            <Text style={styles.upcomingPrize}>Prize: ₹ 2,500</Text>
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
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  chipWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center', // Strict horizontal alignment
  },
  categoryChip: {
    height: 32, // Fixed height prevents stretching
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#006666',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  feedScroll: {
    flex: 1,
    padding: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  resultsCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    gap: 5,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0D9488',
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  spotsLeftText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  prizeBox: {
    alignItems: 'flex-end',
  },
  prizeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  prizeVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#008080',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  judgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  judgeAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
  },
  judgeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  judgeRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  actionCol: {
    alignItems: 'flex-end',
    gap: 5,
  },
  entryFee: {
    fontSize: 11,
    color: '#64748B',
  },
  feeAmount: {
    fontWeight: '800',
    color: '#0F172A',
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006666',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  upcomingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    opacity: 0.9,
  },
  upcomingBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  upcomingBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  upcomingGenre: {
    fontSize: 11,
    color: '#64748B',
  },
  upcomingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  upcomingDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  upcomingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 12,
  },
  upcomingDate: {
    fontSize: 11,
    color: '#64748B',
  },
  upcomingPrize: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
});
