import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Judge } from '../../types/competition';

interface JudgeCardProps {
  judge: Judge;
  onPlayIntro?: () => void;
}

export const JudgeCard: React.FC<JudgeCardProps> = ({ judge, onPlayIntro }) => {
  const handlePlayIntro = () => {
    if (onPlayIntro) {
      onPlayIntro();
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* Judge Avatar */}
      <Image
        source={{
          uri:
            judge.avatarUrl ||
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        }}
        style={styles.avatar}
      />

      {/* Judge Information */}
      <View style={styles.infoCol}>
        <Text style={styles.roleLabel}>{judge.role || 'Judge'}</Text>
        <Text style={styles.judgeName}>{judge.name}</Text>
        <Text style={styles.designation}>{judge.designation}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>

      {/* Intro Video Button */}
      <Pressable
        style={styles.introVideoContainer}
        onPress={handlePlayIntro}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.playCircle}>
          <Ionicons name="play" size={18} color="#0D9488" style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.introText}>Intro Video</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E2E8F0',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  roleLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 1,
  },
  judgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  designation: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  experience: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  introVideoContainer: {
    alignItems: 'center',
    marginLeft: 8,
  },
  playCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
});
