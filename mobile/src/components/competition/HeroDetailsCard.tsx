import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface HeroDetailsCardProps {
  competition: Competition;
  isRegistered: boolean;
}

export const HeroDetailsCard: React.FC<HeroDetailsCardProps> = ({
  competition,
  isRegistered,
}) => {
  const spotsRemaining =
    competition.eligibility?.spotsRemaining ??
    Math.max(0, competition.capacity - competition.participantCount);

  const fillPercentage = Math.min(
    100,
    Math.max(0, (competition.participantCount / competition.capacity) * 100)
  );

  return (
    <View style={styles.container}>
      {/* Title & Registration Status Badge */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{competition.title}</Text>
        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#0D9488" />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        ) : (
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>Open</Text>
          </View>
        )}
      </View>

      {/* Category, Tags & Certificate Badge */}
      <View style={styles.tagsRow}>
        {competition.tags?.map((tag, idx) => (
          <View key={idx} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        <View style={styles.certificateRow}>
          <FontAwesome5 name="trophy" size={12} color="#0D9488" />
          <Text style={styles.certificateText}>
            {competition.badge || 'Winners get certificate'}
          </Text>
        </View>
      </View>

      {/* Metrics Row: Prize Pool, Entry Fee, Spots Progress */}
      <View style={styles.metricsRow}>
        {/* Prize Pool */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Prize Pool</Text>
          <Text style={styles.prizePoolValue}>
            {competition.currency} {competition.prizePool?.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>Entry Fee</Text>
          <Text style={styles.entryFeeValue}>
            {competition.currency} {competition.entryFee}
          </Text>
        </View>

        {/* Spots Left & Progress Bar */}
        <View style={styles.spotsCol}>
          <View style={styles.spotsHeader}>
            <Ionicons name="people-outline" size={14} color="#0D9488" />
            <Text style={styles.spotsText}>
              {spotsRemaining > 0
                ? `Only ${spotsRemaining} spots left`
                : 'Full capacity'}
            </Text>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${fillPercentage}%` },
              ]}
            />
          </View>

          <Text style={styles.bookedText}>
            {competition.participantCount} / {competition.capacity} Booked
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    letterSpacing: -0.3,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  openBadge: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  certificateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 2,
  },
  certificateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 10,
  },
  metricCol: {
    minWidth: 80,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  prizePoolValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#008080',
    letterSpacing: -0.5,
  },
  entryFeeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  spotsCol: {
    flex: 1,
    maxWidth: 155,
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginBottom: 6,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 2,
  },
  bookedText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
});
