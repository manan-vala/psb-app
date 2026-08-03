import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter, useFocusEffect } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import * as LocalAuthentication from 'expo-local-authentication';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import {
  getBiometricPreference,
  getProfile,
  logout,
  setBiometricPreference,
  UserProfile,
} from '../../services/auth';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

export default function SettingsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  const refresh = useCallback(async () => {
    const [p, hw, pref] = await Promise.all([
      getProfile(),
      LocalAuthentication.hasHardwareAsync(),
      getBiometricPreference(),
    ]);
    setProfile(p);
    setHasHardware(hw);
    setBiometricEnabled(pref);
    if (hw) {
      setIsEnrolled(await LocalAuthentication.isEnrolledAsync());
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleToggleBiometric = async (value: boolean) => {
    if (value && hasHardware && !isEnrolled) {
      Alert.alert(
        'No Fingerprint Found',
        'Please set up a fingerprint or biometric ID in your device settings before enabling biometric login.'
      );
      return;
    }
    setBiometricEnabled(value);
    await setBiometricPreference(value);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const biometricSubtext = !hasHardware
    ? 'Not available on this device'
    : !isEnrolled
    ? 'No fingerprint set up on this device'
    : 'Use your fingerprint to log in faster';

  return (
    <View style={styles.container}>
      <TopAppBar title="Settings" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQjBgeQDeL4JdgQLQTNs6N5dkEhVauZMUCcHKvAMrKNFe3v6t_02_8LTqiaSeOQafTBon_m18Gxmns89OPvk06uKEXhxcvnL66O_zrmjTONka4RWnGkPuDy6izVg74IwveKr75UUXszRLsJ_WtqtxMCzrs394mNf76OIjflVp5o_WVp9jlTY7osmc1hrLnOUwrzzU5f1H5137udqy8Om7aKv-fWjMFLH3WiTWV18pVVCTAPkjhUbxX5vEVlZcIhNQmNB0ze_hovUw' }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.fullName ?? 'Bob World Customer'}</Text>
            <Text style={styles.profileSub}>{profile?.mobile ?? '—'}</Text>
            {!!profile?.email && <Text style={styles.profileSub}>{profile.email}</Text>}
          </View>
        </View>

        <SectionLabel label="Security" />
        <View style={styles.card}>
          <SettingsRow
            icon="password"
            label="Change PIN"
            sub="Reset your 4-digit login PIN"
            onPress={() => router.push({ pathname: '/(auth)/password-login', params: { next: 'set-pin' } })}
          />
          <Divider />
          <SettingsRow icon="lock-reset" label="Change Password" sub="Update your account password" onPress={() => comingSoon('Changing your password')} />
          <Divider />
          <View style={styles.switchRow}>
            <View style={styles.switchIconWrapper}>
              <MaterialIcons name="fingerprint" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Biometric Login</Text>
              <Text style={styles.rowSub}>{biometricSubtext}</Text>
            </View>
            <Switch
              value={biometricEnabled && hasHardware}
              onValueChange={handleToggleBiometric}
              disabled={!hasHardware}
              trackColor={{ false: Colors.outlineVariant, true: Colors.primaryContainer }}
              thumbColor={biometricEnabled && hasHardware ? Colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <SectionLabel label="Preferences" />
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchIconWrapper}>
              <MaterialIcons name="notifications-none" size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Push Notifications</Text>
              <Text style={styles.rowSub}>Alerts for transactions & offers</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: Colors.outlineVariant, true: Colors.primaryContainer }}
              thumbColor={pushEnabled ? Colors.primary : '#f4f3f4'}
            />
          </View>
          <Divider />
          <SettingsRow icon="language" label="Language" sub="English (India)" onPress={() => comingSoon('Language settings')} />
        </View>

        <SectionLabel label="About" />
        <View style={styles.card}>
          <SettingsRow icon="description" label="Terms & Conditions" onPress={() => comingSoon('Terms & Conditions')} />
          <Divider />
          <SettingsRow icon="privacy-tip" label="Privacy Policy" onPress={() => comingSoon('Privacy Policy')} />
          <Divider />
          <SettingsRow icon="info-outline" label="App Version" sub="1.0.0" onPress={undefined} />
        </View>

        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={Colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function SettingsRow({
  icon,
  label,
  sub,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  sub?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.6 : 1}>
      <View style={styles.switchIconWrapper}>
        <MaterialIcons name={icon} size={22} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {!!onPress && <MaterialIcons name="chevron-right" size={22} color={Colors.onSurfaceVariant} />}
    </TouchableOpacity>
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
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  profileName: { ...Typography.bodyLg, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  profileSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  sectionLabel: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    paddingLeft: 4,
    marginTop: Spacing.stackMd,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    overflow: 'hidden',
    ...Shadows.low,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.stackMd },
  switchRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.stackMd },
  switchIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: { ...Typography.bodyMd, fontFamily: 'WorkSans-Medium', color: Colors.onSurface },
  rowSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.surfaceContainerHighest, marginLeft: 68 },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: BorderRadius.DEFAULT,
    borderWidth: 1.5,
    borderColor: Colors.error,
    marginTop: Spacing.stackLg,
  },
  logoutText: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.error },
});
