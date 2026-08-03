import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const products = [
  { id: '1', label: 'Personal Loan', icon: 'account-balance-wallet', rate: 'From 10.5% p.a.', desc: 'Up to ₹15,00,000, quick disbursal', color: Colors.primaryContainer },
  { id: '2', label: 'Home Loan', icon: 'home', rate: 'From 8.4% p.a.', desc: 'Up to ₹5 Cr, tenure up to 30 years', color: Colors.secondaryContainer },
  { id: '3', label: 'Car Loan', icon: 'directions-car', rate: 'From 9.1% p.a.', desc: 'Up to 90% on-road funding', color: Colors.tertiaryContainer },
  { id: '4', label: 'Education Loan', icon: 'school', rate: 'From 9.5% p.a.', desc: 'For domestic & overseas studies', color: Colors.errorContainer },
];

export default function LoansScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TopAppBar title="Loans" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.activeCard}>
          <MaterialIcons name="check-circle-outline" size={22} color={Colors.secondary} />
          <Text style={styles.activeText}>You have no active loans right now.</Text>
        </View>

        <Text style={styles.sectionTitle}>Explore Loan Products</Text>
        <View style={styles.list}>
          {products.map((p) => (
            <View key={p.id} style={styles.card}>
              <View style={[styles.iconWrapper, { backgroundColor: p.color + '55' }]}>
                <MaterialIcons name={p.icon as any} size={26} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{p.label}</Text>
                <Text style={styles.cardDesc}>{p.desc}</Text>
                <Text style={styles.cardRate}>{p.rate}</Text>
              </View>
              <TouchableOpacity style={styles.applyBtn} onPress={() => comingSoon(`Applying for a ${p.label}`)}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.calcCard}>
          <MaterialIcons name="calculate" size={22} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.calcTitle}>EMI Calculator</Text>
            <Text style={styles.calcDesc}>Estimate your monthly installment before applying.</Text>
          </View>
          <TouchableOpacity onPress={() => comingSoon('The EMI calculator')}>
            <MaterialIcons name="arrow-forward-ios" size={16} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.marginMobile, paddingBottom: 100 },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceContainer,
    padding: Spacing.stackMd,
    borderRadius: BorderRadius.DEFAULT,
    marginBottom: Spacing.stackLg,
  },
  activeText: { ...Typography.bodySm, color: Colors.onSurfaceVariant, flex: 1 },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.stackMd },
  list: { gap: Spacing.stackMd, marginBottom: Spacing.stackLg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  cardDesc: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  cardRate: { ...Typography.labelMd, color: Colors.primary, marginTop: 4 },
  applyBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  applyText: { ...Typography.labelMd, color: Colors.primary },
  calcCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
    ...Shadows.low,
  },
  calcTitle: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  calcDesc: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
});
