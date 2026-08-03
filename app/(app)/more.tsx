import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { getProfile, logout } from '../../services/auth';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const menuItems = [
  { label: 'Fixed Deposits', icon: 'savings', route: '/(app)/fixed-deposits' },
  { label: 'Cards', icon: 'credit-card', route: '/(app)/cards' },
  { label: 'Loans', icon: 'real-estate-agent', route: '/(app)/loans' },
  { label: 'Offers', icon: 'local-offer', route: '/(app)/offers' },
  { label: 'Statements', icon: 'receipt-long', route: null },
  { label: 'Rewards', icon: 'redeem', route: null },
  { label: 'Manage Beneficiaries', icon: 'group', route: null },
  { label: 'Support', icon: 'headset-mic', route: '/(app)/support' },
  { label: 'Settings', icon: 'settings', route: '/(app)/settings' },
];

export default function MoreScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [userName, setUserName] = useState('Bob World Customer');

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile?.fullName) setUserName(profile.fullName);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <TopAppBar title="More" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQjBgeQDeL4JdgQLQTNs6N5dkEhVauZMUCcHKvAMrKNFe3v6t_02_8LTqiaSeOQafTBon_m18Gxmns89OPvk06uKEXhxcvnL66O_zrmjTONka4RWnGkPuDy6izVg74IwveKr75UUXszRLsJ_WtqtxMCzrs394mNf76OIjflVp5o_WVp9jlTY7osmc1hrLnOUwrzzU5f1H5137udqy8Om7aKv-fWjMFLH3WiTWV18pVVCTAPkjhUbxX5vEVlZcIhNQmNB0ze_hovUw' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileSub}>View & manage your profile</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.onSurfaceVariant} />
        </View>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridItem}
              onPress={() => (item.route ? router.push(item.route as any) : comingSoon(item.label))}
            >
              <View style={styles.gridIconWrapper}>
                <MaterialIcons name={item.icon as any} size={24} color={Colors.primary} />
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Bob World v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.marginMobile, paddingBottom: 100 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackMd,
    marginBottom: Spacing.stackLg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  profileName: { ...Typography.bodyLg, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  profileSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.stackLg,
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.DEFAULT,
    paddingVertical: Spacing.stackMd,
    marginBottom: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '30',
  },
  gridIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: { ...Typography.labelMd, color: Colors.onSurface, textAlign: 'center' },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: BorderRadius.DEFAULT,
    borderWidth: 1.5,
    borderColor: Colors.error,
    marginTop: Spacing.stackSm,
  },
  logoutText: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.error },
  versionText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: Spacing.stackLg,
  },
});
