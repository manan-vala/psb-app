import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Button } from './Button';
import { getProfile, logout } from '../../services/auth';

// usePathname() strips route-group segments like "(app)", so routes must be
// compared without that prefix (router.push still needs the full path).
const stripGroup = (route: string) => route.replace(/^\/\(app\)/, '') || '/';

export function DrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('Bob World Customer');

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.fullName) setUserName(profile.fullName);
    });
  }, []);

  const navItems = [
    { label: 'My Accounts', icon: 'account-balance', route: '/(app)/home' },
    { label: 'Fixed Deposits', icon: 'savings', route: '/(app)/fixed-deposits' },
    { label: 'Cards', icon: 'credit-card', route: '/(app)/cards' },
    { label: 'Loans', icon: 'real-estate-agent', route: '/(app)/loans' },
    { label: 'Offers', icon: 'local-offer', route: '/(app)/offers' },
    { label: 'Support', icon: 'headset-mic', route: '/(app)/support', divider: true },
    { label: 'Settings', icon: 'settings', route: '/(app)/settings' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQjBgeQDeL4JdgQLQTNs6N5dkEhVauZMUCcHKvAMrKNFe3v6t_02_8LTqiaSeOQafTBon_m18Gxmns89OPvk06uKEXhxcvnL66O_zrmjTONka4RWnGkPuDy6izVg74IwveKr75UUXszRLsJ_WtqtxMCzrs394mNf76OIjflVp5o_WVp9jlTY7osmc1hrLnOUwrzzU5f1H5137udqy8Om7aKv-fWjMFLH3WiTWV18pVVCTAPkjhUbxX5vEVlZcIhNQmNB0ze_hovUw' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Premier Customer</Text>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.navSection}>
          {navItems.map((item, index) => {
            const isActive = pathname === stripGroup(item.route);
            return (
              <React.Fragment key={item.label}>
                {item.divider && <View style={styles.divider} />}
                <TouchableOpacity
                  style={[
                    styles.navItem,
                    isActive && styles.navItemActive,
                  ]}
                  onPress={() => {
                    // Close drawer and navigate
                    props.navigation.closeDrawer();
                    router.push(item.route as any);
                  }}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color={isActive ? Colors.primary : Colors.secondary}
                    style={styles.navIcon}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      isActive && styles.navLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer / Logout */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.stackMd) }]}>
        <Button
          label="Logout"
          variant="secondary"
          icon="logout"
          onPress={async () => {
            props.navigation.closeDrawer();
            await logout();
            router.replace('/(auth)/login');
          }}
          style={{ height: 48, borderRadius: 24 }} // Custom styling for this button
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileSection: {
    padding: Spacing.stackLg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHighest,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: Spacing.stackSm,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Colors.primaryFixed + '80', // semi-transparent
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    ...Typography.labelMd,
    color: Colors.primary,
  },
  navSection: {
    paddingVertical: Spacing.stackMd,
    paddingRight: Spacing.stackMd, // For the pill shape
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.stackLg,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: Colors.primaryContainer,
  },
  navIcon: {
    marginRight: 16,
  },
  navLabel: {
    ...Typography.bodyLg,
    color: Colors.onSurface,
  },
  navLabelActive: {
    color: Colors.onPrimaryContainer,
    fontFamily: 'WorkSans-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHighest,
    marginVertical: 8,
    marginLeft: Spacing.stackLg,
  },
  footer: {
    paddingHorizontal: Spacing.stackLg,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHighest,
    paddingTop: Spacing.stackMd,
  },
});
