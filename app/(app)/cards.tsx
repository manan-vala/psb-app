import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const cardsData = [
  { id: '1', type: 'Debit Card', name: 'BOB World Debit', last4: '4321', expiry: '09/29', gradient: [Colors.primary, '#AD3300'], locked: false },
  { id: '2', type: 'Credit Card', name: 'BOB Premier Credit', last4: '8890', expiry: '03/28', gradient: [Colors.secondary, '#1D355E'], locked: false },
];

const actions = [
  { label: 'Block Card', icon: 'block' },
  { label: 'Set Limits', icon: 'tune' },
  { label: 'View PIN', icon: 'password' },
  { label: 'Manage', icon: 'settings' },
] as const;

export default function CardsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const active = cardsData[selected];

  return (
    <View style={styles.container}>
      <TopAppBar title="Cards" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardScroll}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / 300);
            setSelected(Math.min(Math.max(idx, 0), cardsData.length - 1));
            setRevealed(false);
          }}
        >
          {cardsData.map((c) => (
            <View key={c.id} style={[styles.card, { backgroundColor: c.gradient[0] }]}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardType}>{c.type}</Text>
                <MaterialIcons name="contactless" size={24} color="#fff" />
              </View>
              <Text style={styles.cardNumber}>
                {revealed && c.id === active.id ? `4532 8891 2210 ${c.last4}` : `•••• •••• •••• ${c.last4}`}
              </Text>
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>{c.name}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>{c.expiry}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsRow}>
          {cardsData.map((c, i) => (
            <View key={c.id} style={[styles.dot, i === selected && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.revealRow} onPress={() => setRevealed((r) => !r)}>
          <MaterialIcons name={revealed ? 'visibility-off' : 'visibility'} size={20} color={Colors.primary} />
          <Text style={styles.revealText}>{revealed ? 'Hide card number' : 'Show card number'}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Manage Card</Text>
        <View style={styles.actionsGrid}>
          {actions.map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionItem} onPress={() => comingSoon(a.label)}>
              <View style={styles.actionIconWrapper}>
                <MaterialIcons name={a.icon as any} size={26} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <MaterialIcons name="info-outline" size={20} color={Colors.secondary} />
          <Text style={styles.infoText}>Card controls are simulated in this demo build.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingVertical: Spacing.marginMobile, paddingBottom: 100 },
  cardScroll: { paddingHorizontal: Spacing.marginMobile, gap: 16 },
  card: {
    width: 300,
    height: 180,
    borderRadius: BorderRadius.lg,
    padding: 20,
    justifyContent: 'space-between',
    ...Shadows.high,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardType: { ...Typography.labelMd, color: '#fff', letterSpacing: 1 },
  cardNumber: { ...Typography.headlineSm, color: '#fff', letterSpacing: 2 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLabel: { ...Typography.labelMd, color: '#ffffffb0', fontSize: 10 },
  cardValue: { ...Typography.bodyMd, color: '#fff', fontFamily: 'WorkSans-Medium' },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: Spacing.stackMd },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.outlineVariant },
  dotActive: { backgroundColor: Colors.primary, width: 16 },
  revealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.stackMd,
    marginBottom: Spacing.stackLg,
  },
  revealText: { ...Typography.labelMd, color: Colors.primary },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginBottom: Spacing.stackMd,
    paddingHorizontal: Spacing.marginMobile,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.marginMobile,
    justifyContent: 'space-between',
    marginBottom: Spacing.stackLg,
  },
  actionItem: { width: '23%', alignItems: 'center' },
  actionIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryContainer + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: { ...Typography.labelMd, color: Colors.onSurface, textAlign: 'center' },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.marginMobile,
    backgroundColor: Colors.surfaceContainer,
    padding: 12,
    borderRadius: BorderRadius.DEFAULT,
  },
  infoText: { ...Typography.bodySm, color: Colors.onSurfaceVariant, flex: 1 },
});
