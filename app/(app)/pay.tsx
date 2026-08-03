import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const billers = [
  { label: 'Mobile Recharge', icon: 'smartphone', color: Colors.primaryContainer },
  { label: 'Electricity', icon: 'bolt', color: Colors.secondaryContainer },
  { label: 'DTH', icon: 'live-tv', color: Colors.tertiaryContainer },
  { label: 'Broadband', icon: 'wifi', color: Colors.errorContainer },
  { label: 'Water Bill', icon: 'water-drop', color: Colors.primaryContainer },
  { label: 'Gas Bill', icon: 'local-fire-department', color: Colors.secondaryContainer },
  { label: 'Credit Card', icon: 'credit-card', color: Colors.tertiaryContainer },
  { label: 'Insurance', icon: 'shield', color: Colors.errorContainer },
];

const recentBillers = [
  { name: 'Airtel Postpaid', sub: 'Mobile • •••• 4321', icon: 'smartphone' },
  { name: 'Tata Power', sub: 'Electricity • Account 998211', icon: 'bolt' },
];

export default function PayScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TopAppBar title="Pay" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.scanCard} onPress={() => comingSoon('Scan & Pay')}>
          <View style={styles.scanIconWrapper}>
            <MaterialIcons name="qr-code-scanner" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>Scan & Pay</Text>
            <Text style={styles.scanSub}>Pay instantly using any UPI QR code</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#fff" />
        </TouchableOpacity>

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickItem} onPress={() => router.push('/(app)/transfer')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: Colors.primaryContainer + '55' }]}>
              <MaterialIcons name="swap-horiz" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickLabel}>To Bank / UPI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem} onPress={() => comingSoon('Mobile Number payments')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: Colors.secondaryContainer + '55' }]}>
              <MaterialIcons name="contacts" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickLabel}>To Mobile No.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickItem} onPress={() => comingSoon('Self transfer')}>
            <View style={[styles.quickIconWrapper, { backgroundColor: Colors.tertiaryContainer + '55' }]}>
              <MaterialIcons name="account-balance-wallet" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.quickLabel}>Self Transfer</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Bill Payments</Text>
        <View style={styles.grid}>
          {billers.map((b) => (
            <TouchableOpacity key={b.label} style={styles.gridItem} onPress={() => comingSoon(b.label)}>
              <View style={[styles.gridIconWrapper, { backgroundColor: b.color + '33' }]}>
                <MaterialIcons name={b.icon as any} size={26} color={Colors.primary} />
              </View>
              <Text style={styles.gridLabel}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Billers</Text>
        <View style={styles.list}>
          {recentBillers.map((r) => (
            <TouchableOpacity key={r.name} style={styles.recentRow} onPress={() => comingSoon(`Pay ${r.name}`)}>
              <View style={styles.recentIconWrapper}>
                <MaterialIcons name={r.icon as any} size={20} color={Colors.onSecondaryContainer} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recentName}>{r.name}</Text>
                <Text style={styles.recentSub}>{r.sub}</Text>
              </View>
              <Text style={styles.payAgainText}>Pay</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.marginMobile, paddingBottom: 100 },
  scanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackMd,
    marginBottom: Spacing.stackLg,
    ...Shadows.high,
  },
  scanIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff33',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scanTitle: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: '#fff' },
  scanSub: { ...Typography.bodySm, color: '#ffffffcc', marginTop: 2 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.stackLg },
  quickItem: { alignItems: 'center', width: '31%' },
  quickIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLabel: { ...Typography.labelMd, color: Colors.onSurface, textAlign: 'center' },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.stackMd },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: Spacing.stackLg,
    gap: 16,
  },
  gridItem: { width: '21%', alignItems: 'center' },
  gridIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridLabel: { ...Typography.labelMd, color: Colors.onSurface, textAlign: 'center', fontSize: 11 },
  list: { gap: Spacing.stackMd },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.DEFAULT,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  recentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentName: { ...Typography.bodyMd, fontFamily: 'WorkSans-Medium', color: Colors.onSurface },
  recentSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  payAgainText: { ...Typography.labelMd, color: Colors.primary },
});
