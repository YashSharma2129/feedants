import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Competition } from '../../types/competition';

interface BottomStickyBarProps {
  competition: Competition;
  isRegistered: boolean;
  isSubmitting: boolean;
  onPressAction: () => void;
}

export const BottomStickyBar: React.FC<BottomStickyBarProps> = ({
  competition,
  isRegistered,
  isSubmitting,
  onPressAction,
}) => {
  const isFull = competition.eligibility?.isFull;
  const isClosed = !competition.eligibility?.canRegister && !isRegistered;

  const getButtonText = () => {
    if (isRegistered) {
      return {
        main: 'Upload Submission',
        sub: 'Registered',
      };
    }
    if (isFull) {
      return {
        main: 'Competition Full',
        sub: 'All 20 spots taken',
      };
    }
    if (isClosed) {
      return {
        main: 'Registration Closed',
        sub: competition.eligibility?.reason || 'Deadline passed',
      };
    }
    return {
      main: `Register Now - ${competition.currency} ${competition.entryFee}`,
      sub: `${competition.eligibility?.spotsRemaining ?? 19} spots remaining`,
    };
  };

  const { main, sub } = getButtonText();

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (isClosed || isFull) && !isRegistered && styles.disabledButton,
          pressed && !isSubmitting && styles.buttonPressed,
        ]}
        onPress={onPressAction}
        disabled={isSubmitting || ((isClosed || isFull) && !isRegistered)}
      >
        {isSubmitting ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.mainText}>Processing Registration...</Text>
          </View>
        ) : (
          <View style={styles.contentCol}>
            <Text style={styles.mainText}>{main}</Text>
            {sub ? <Text style={styles.subText}>{sub}</Text> : null}
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  button: {
    backgroundColor: '#006666',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  contentCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  subText: {
    color: '#CCFBF1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
});
