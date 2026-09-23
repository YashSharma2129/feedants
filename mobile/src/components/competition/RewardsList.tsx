import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Reward } from '../../types/competition';

interface RewardsListProps {
  rewards: Reward[];
  currency?: string;
}

export const RewardsList: React.FC<RewardsListProps> = ({
  rewards,
  currency = '₹',
}) => {
  const getRankVectorIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FontAwesome5 name="trophy" size={15} color="#EAB308" />;
      case 2:
        return <FontAwesome5 name="medal" size={16} color="#94A3B8" />;
      case 3:
        return <FontAwesome5 name="medal" size={16} color="#D97706" />;
      default:
        return <Ionicons name="star-outline" size={16} color="#0D9488" />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Rewards</Text>
        <Text style={styles.headerSubtitle}>(All Positions)</Text>
      </View>

      {/* Reward Rows */}
      <View style={styles.list}>
        {rewards?.map((item) => (
          <View key={item.rank} style={styles.rewardRow}>
            <View style={styles.leftGroup}>
              <View style={styles.iconBox}>{getRankVectorIcon(item.rank)}</View>
              <Text style={styles.rankTitle}>{item.title}</Text>
            </View>

            <Text style={styles.amount}>
              {currency} {item.amount}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  list: {
    gap: 12,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#008080',
  },
});
