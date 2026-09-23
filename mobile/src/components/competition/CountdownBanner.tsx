import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CountdownBannerProps {
  initialSecondsRemaining?: number;
  deadlineIso?: string;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({
  initialSecondsRemaining,
  deadlineIso,
}) => {
  const calculateSecondsLeft = () => {
    if (deadlineIso) {
      const deadline = new Date(deadlineIso).getTime();
      const now = Date.now();
      return Math.max(0, Math.floor((deadline - now) / 1000));
    }
    return initialSecondsRemaining ?? 109600;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft);

  useEffect(() => {
    setSecondsLeft(calculateSecondsLeft());
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineIso, initialSecondsRemaining]);

  const days = Math.floor(secondsLeft / (3600 * 24));
  const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedCountdown = `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;

  return (
    <View style={styles.bannerContainer}>
      {/* Left: Hourglass + Label */}
      <View style={styles.leftGroup}>
        <Ionicons name="hourglass-outline" size={13} color="#0D9488" />
        <Text style={styles.closesLabel}>
          Registration closes in
        </Text>
      </View>

      {/* Center: Digits */}
      <Text style={styles.timerDigits}>
        {formattedCountdown}
      </Text>

      {/* Right: Stopwatch + Hurry up */}
      <View style={styles.rightGroup}>
        <Ionicons name="timer-outline" size={13} color="#0D9488" />
        <Text style={styles.hurryText}>
          Hurry up!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 10,
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  closesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  timerDigits: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  hurryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
});
