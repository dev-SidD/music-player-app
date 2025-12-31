import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Tab = 'Songs' | 'Artists' | 'Albums';

type TabNavigationProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: Tab[] = ['Songs', 'Artists', 'Albums'];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab}
          onPress={() => onTabChange(tab)}
          style={styles.tab}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}
          >
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.activeIndicator} />}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  tab: {
    marginRight: spacing.l,
    paddingVertical: spacing.s,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});

