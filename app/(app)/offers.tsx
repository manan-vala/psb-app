import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const offers = [
  { id: '1', title: '10% Cashback on Amazon', desc: 'Use your BOB Debit Card, up to ₹500 back', icon: 'shopping-bag', expiry: 'Valid till 31 Aug 2026', color: Colors.primaryContainer },
  { id: '2', title: 'Zero Forex Markup', desc: 'On international spends with Premier Credit Card', icon: 'public', expiry: 'Valid till 30 Sep 2026', color: Colors.secondaryContainer },
  { id: '3', title: '5% Off Dining', desc: 'At 500+ partner restaurants nationwide', icon: 'restaurant', expiry: 'Valid till 15 Sep 2026', color: Colors.tertiaryContainer },
  { id: '4', title: 'Fuel Surcharge Waiver', desc: '1% waiver at all major fuel stations', icon: 'local-gas-station', expiry: 'Valid till 31 Dec 2026', color: Colors.errorContainer },
];

export default function OffersScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TopAppBar title="Offers" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerText}>Curated deals based on your cards & spending</Text>

        <View style={styles.list}>
          {offers.map((o) => (
            <TouchableOpacity key={o.id} style={styles.card} onPress={() => comingSoon(o.title)}>
              <View style={[styles.iconWrapper, { backgroundColor: o.color + '55' }]}>
                <MaterialIcons name={o.icon as any} size={26} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{o.title}</Text>
                <Text style={styles.cardDesc}>{o.desc}</Text>
                <View style={styles.expiryRow}>
                  <MaterialIcons name="schedule" size={14} color={Colors.onSurfaceVariant} />
                  <Text style={styles.expiryText}>{o.expiry}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={Colors.onSurfaceVariant} />
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
  headerText: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginBottom: Spacing.stackLg },
  list: { gap: Spacing.stackMd },
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
  expiryRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  expiryText: { ...Typography.labelMd, color: Colors.onSurfaceVariant },
});
