import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

interface BottomNavBarProps {
  activeTab?: string;
  onTabPress?: (tabName: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab = 'Competitions',
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Home */}
      <Pressable
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('Home')}
      >
        <Ionicons
          name="home"
          size={20}
          color={activeTab === 'Home' ? '#0D9488' : '#94A3B8'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'Home' && styles.navLabelActive,
          ]}
        >
          Home
        </Text>
      </Pressable>

      {/* 2. Explore */}
      <Pressable
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('Explore')}
      >
        <Ionicons
          name="search"
          size={20}
          color={activeTab === 'Explore' ? '#0D9488' : '#94A3B8'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'Explore' && styles.navLabelActive,
          ]}
        >
          Explore
        </Text>
      </Pressable>

      {/* 3. Center FAB (+) */}
      <Pressable
        style={styles.centerFabContainer}
        onPress={() => onTabPress && onTabPress('Create')}
      >
        <View style={styles.centerFab}>
          <Feather name="plus" size={24} color="#FFFFFF" />
        </View>
      </Pressable>

      {/* 4. Competitions (Active) */}
      <Pressable
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('Competitions')}
      >
        <Ionicons
          name="trophy"
          size={20}
          color={activeTab === 'Competitions' ? '#0D9488' : '#94A3B8'}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'Competitions' && styles.navLabelActive,
          ]}
        >
          Competitions
        </Text>
      </Pressable>

      {/* 5. Profile */}
      <Pressable
        style={styles.navItem}
        onPress={() => onTabPress && onTabPress('Profile')}
      >
        <Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
          }}
          style={styles.avatarImg}
        />
        <Text
          style={[
            styles.navLabel,
            activeTab === 'Profile' && styles.navLabelActive,
          ]}
        >
          Profile
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    gap: 3,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  navLabelActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  centerFabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  centerFab: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#006666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
  },
});
