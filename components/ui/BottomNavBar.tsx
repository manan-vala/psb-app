import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/theme';

export function BottomNavBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', icon: 'home', route: '/(app)/home' },
    { name: 'Transfer', icon: 'swap-horiz', route: '/(app)/transfer' }, // sync-alt substitute
    { name: 'Pay', icon: 'payments', route: '/(app)/pay' }, // placeholder
    { name: 'More', icon: 'more-horiz', route: '/(app)/more' }, // placeholder
  ];

  if (pathname === '/confirm' || pathname === '/(app)/confirm') {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => {
              if (!isActive) {
                // In a real app we might use router.push or router.replace depending on tab behavior.
                // expo-router Tabs handles this natively, but since we are using custom layout we can use router.push
                router.push(tab.route as any);
              }
            }}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <MaterialIcons
              name={tab.icon as any}
              size={24}
              color={isActive ? Colors.primary : Colors.secondary}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    ...Shadows.low,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHighest,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 48,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 4,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    ...Typography.labelMd,
  },
  labelActive: {
    color: Colors.primary,
    fontFamily: 'WorkSans-Bold', // or SemiBold if Bold not available
  },
  labelInactive: {
    color: Colors.secondary,
  },
});
