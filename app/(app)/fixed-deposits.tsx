import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { Button } from '../../components/ui/Button';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const deposits = [
  { id: '1', label: 'Family Goal FD', amount: 250000, rate: 7.1, tenure: '2 years', maturity: '14 Nov 2027', progress: 0.62 },
  { id: '2', label: 'Tax Saver FD', amount: 150000, rate: 6.75, tenure: '5 years', maturity: '02 Mar 2031', progress: 0.18 },
  { id: '3', label: 'Short Term FD', amount: 50000, rate: 6.4, tenure: '6 months', maturity: '20 Sep 2026', progress: 0.85 },
];

export default function FixedDepositsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const totalValue = deposits.reduce((sum, d) => sum + d.amount, 0);

  return (
    <View style={styles.container}>
      <TopAppBar title="Fixed Deposits" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryBlob} />
          <Text style={styles.summaryLabel}>Total FD Value</Text>
          <Text style={styles.summaryAmount}>
            ₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.summarySub}>Across {deposits.length} active deposits</Text>
        </View>

        <Button label="Open New FD" icon="add-circle-outline" onPress={() => comingSoon('Opening a new Fixed Deposit')} style={{ marginBottom: Spacing.stackLg }} />

        <Text style={styles.sectionTitle}>Your Deposits</Text>
        <View style={styles.list}>
          {deposits.map((d) => (
            <TouchableOpacity key={d.id} style={styles.card} onPress={() => comingSoon(`Details for ${d.label}`)}>
              <View style={styles.cardHeader}>
                <View style={styles.iconWrapper}>
                  <MaterialIcons name="savings" size={22} color={Colors.onPrimaryContainer} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{d.label}</Text>
                  <Text style={styles.cardSub}>Matures {d.maturity}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View>
                  <Text style={styles.metricLabel}>Principal</Text>
                  <Text style={styles.metricValue}>₹{d.amount.toLocaleString('en-IN')}</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Interest Rate</Text>
                  <Text style={styles.metricValue}>{d.rate}% p.a.</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Tenure</Text>
                  <Text style={styles.metricValue}>{d.tenure}</Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${d.progress * 100}%` }]} />
              </View>
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
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackLg,
    marginBottom: Spacing.stackLg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
    overflow: 'hidden',
    ...Shadows.low,
  },
  summaryBlob: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '1A',
  },
  summaryLabel: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  summaryAmount: { ...Typography.displayLg, color: Colors.primary, marginTop: 4 },
  summarySub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 4 },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.stackMd },
  list: { gap: Spacing.stackMd },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.stackMd },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  cardSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  statusPill: {
    backgroundColor: '#4ade8033',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusText: { ...Typography.labelMd, color: '#16a34a' },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.stackMd },
  metricLabel: { ...Typography.labelMd, color: Colors.onSurfaceVariant, marginBottom: 2 },
  metricValue: { ...Typography.bodyMd, fontFamily: 'WorkSans-Medium', color: Colors.onSurface },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
});
