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
import { PreviousWinner } from '../../types/competition';

interface PreviousWinnersSectionProps {
  winners: PreviousWinner[];
  onWatchWinner?: (winner: PreviousWinner) => void;
}

export const PreviousWinnersSection: React.FC<PreviousWinnersSectionProps> = ({
  winners,
  onWatchWinner,
}) => {
  const handleWatchPerformance = (winner: PreviousWinner) => {
    if (onWatchWinner) {
      onWatchWinner(winner);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Previous Winners</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {winners?.map((winner, index) => (
          <Pressable
            key={index}
            style={styles.winnerCard}
            onPress={() => handleWatchPerformance(winner)}
          >
            {/* Thumbnail with overlay play button */}
            <View style={styles.thumbWrapper}>
              <Image
                source={{ uri: winner.videoThumbnail }}
                style={styles.thumbnail}
              />
              <View style={styles.playBadge}>
                <Ionicons name="play" size={10} color="#FFFFFF" style={{ marginLeft: 1 }} />
              </View>
            </View>

            {/* Name & Rank */}
            <View style={styles.textWrapper}>
              <Text style={styles.winnerName} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.rankTitle}>{winner.rankTitle}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  winnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 6,
    paddingRight: 14,
    gap: 8,
  },
  thumbWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  playBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0D9488',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    justifyContent: 'center',
  },
  winnerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    maxWidth: 90,
  },
  rankTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
    marginTop: 2,
  },
});
