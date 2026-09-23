import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderNavProps {
  onBack?: () => void;
  language: 'ENG' | 'HIN';
  onToggleLanguage: (lang: 'ENG' | 'HIN') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onBack,
  language,
  onToggleLanguage,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="arrow-back" size={22} color="#0F172A" />
        <Text style={styles.backText}>Go back</Text>
      </Pressable>

      <View style={styles.langPillContainer}>
        <Pressable
          style={[
            styles.langOption,
            language === 'ENG' && styles.langOptionActive,
          ]}
          onPress={() => onToggleLanguage('ENG')}
        >
          <Text
            style={[
              styles.langText,
              language === 'ENG' && styles.langTextActive,
            ]}
          >
            ENG
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.langOption,
            language === 'HIN' && styles.langOptionActive,
          ]}
          onPress={() => onToggleLanguage('HIN')}
        >
          <Text
            style={[
              styles.langText,
              language === 'HIN' && styles.langTextActive,
            ]}
          >
            हिंदी
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  langPillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 2,
    alignItems: 'center',
  },
  langOption: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  langOptionActive: {
    backgroundColor: '#006666',
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  langTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
