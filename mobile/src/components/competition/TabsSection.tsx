import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Competition } from '../../types/competition';

interface TabsSectionProps {
  competition: Competition;
}

export const TabsSection: React.FC<TabsSectionProps> = ({ competition }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'judging' | 'rules'>('about');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Tab Headers Row */}
      <View style={styles.tabHeadersRow}>
        <Pressable
          style={[styles.tabHeader, activeTab === 'about' && styles.tabHeaderActive]}
          onPress={() => setActiveTab('about')}
          hitSlop={{ top: 8, bottom: 8 }}
        >
          <Text
            style={[styles.tabHeaderText, activeTab === 'about' && styles.tabHeaderTextActive]}
          >
            About Competition
          </Text>
          {activeTab === 'about' && <View style={styles.activeIndicator} />}
        </Pressable>

        <Pressable
          style={[styles.tabHeader, activeTab === 'judging' && styles.tabHeaderActive]}
          onPress={() => setActiveTab('judging')}
          hitSlop={{ top: 8, bottom: 8 }}
        >
          <Text
            style={[styles.tabHeaderText, activeTab === 'judging' && styles.tabHeaderTextActive]}
          >
            Judging Parameters
          </Text>
          {activeTab === 'judging' && <View style={styles.activeIndicator} />}
        </Pressable>

        <Pressable
          style={[styles.tabHeader, activeTab === 'rules' && styles.tabHeaderActive]}
          onPress={() => setActiveTab('rules')}
          hitSlop={{ top: 8, bottom: 8 }}
        >
          <Text
            style={[styles.tabHeaderText, activeTab === 'rules' && styles.tabHeaderTextActive]}
          >
            Rules & Eligibility
          </Text>
          {activeTab === 'rules' && <View style={styles.activeIndicator} />}
        </Pressable>
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'about' && (
          <View>
            <Text
              style={styles.descriptionText}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {competition.aboutDescription ||
                'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.'}
            </Text>
            {isExpanded && (
              <Text style={[styles.descriptionText, { marginTop: 8 }]}>
                Join passionate classical dancers across the country. Upload your performance before the submission deadline to have your routine professionally evaluated by our veteran Kathak judge. Certificate of participation guaranteed for all valid submissions.
              </Text>
            )}

            <Pressable
              style={styles.viewMoreRow}
              onPress={() => setIsExpanded(!isExpanded)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewMoreText}>
                {isExpanded ? 'View less' : 'View more'}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color="#0D9488"
              />
            </Pressable>
          </View>
        )}

        {activeTab === 'judging' && (
          <View style={styles.parameterList}>
            {competition.judgingParameters?.map((param, index) => (
              <View key={index} style={styles.parameterItem}>
                <View style={styles.paramHeader}>
                  <Text style={styles.paramName}>{param.name}</Text>
                  <View style={styles.weightBadge}>
                    <Text style={styles.paramWeight}>{param.weightage}%</Text>
                  </View>
                </View>
                <Text style={styles.paramDesc}>{param.description}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'rules' && (
          <View style={styles.rulesList}>
            {competition.rules?.map((rule, index) => (
              <View key={index} style={styles.ruleItem}>
                <View style={styles.bulletCircle}>
                  <Text style={styles.bulletNum}>{index + 1}</Text>
                </View>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabHeadersRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  tabHeader: {
    paddingVertical: 12,
    paddingHorizontal: 6,
    position: 'relative',
    alignItems: 'center',
    flex: 1,
  },
  tabHeaderActive: {},
  tabHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  tabHeaderTextActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: 8,
    right: 8,
    height: 2.5,
    backgroundColor: '#0D9488',
    borderRadius: 2,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 100,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
  },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'center',
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D9488',
  },
  parameterList: {
    gap: 10,
  },
  parameterItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paramName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  weightBadge: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  paramWeight: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },
  paramDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  rulesList: {
    gap: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  bulletNum: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  ruleText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
  },
});
