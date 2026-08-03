import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

const comingSoon = (feature: string) =>
  Alert.alert('Coming Soon', `${feature} will be available in a future update.`);

const contactOptions = [
  { id: 'call', label: 'Call Us', sub: '1800-102-4455 (Toll Free)', icon: 'call', action: () => Linking.openURL('tel:18001024455') },
  { id: 'email', label: 'Email Us', sub: 'support@bobworld.example', icon: 'mail-outline', action: () => Linking.openURL('mailto:support@bobworld.example') },
  { id: 'chat', label: 'Chat with Us', sub: 'Average response time: 2 mins', icon: 'chat-bubble-outline', action: () => comingSoon('Live chat') },
];

const faqs = [
  { q: 'How do I reset my PIN?', a: "Go to the PIN login screen and tap 'Forgot PIN?'. Verify your password to set a new one." },
  { q: 'Is biometric login secure?', a: 'Yes — we use your device\'s built-in fingerprint/biometric sensor. No biometric data ever leaves your device.' },
  { q: 'How do I report a suspicious transaction?', a: "Use 'Call Us' or 'Email Us' below to reach our fraud desk immediately." },
  { q: 'Can I use the app on a new device?', a: 'Yes, just create an account and set up your PIN on the new device.' },
];

export default function SupportScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <TopAppBar title="Support" showMenuIcon onMenuPress={() => navigation.openDrawer()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <View style={styles.list}>
          {contactOptions.map((c) => (
            <TouchableOpacity key={c.id} style={styles.contactCard} onPress={c.action}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name={c.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>{c.label}</Text>
                <Text style={styles.contactSub}>{c.sub}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: Spacing.stackLg }]}>Frequently Asked Questions</Text>
        <View style={styles.list}>
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <TouchableOpacity
                key={f.q}
                style={styles.faqCard}
                onPress={() => setOpenIndex(isOpen ? null : i)}
                activeOpacity={0.8}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{f.q}</Text>
                  <MaterialIcons name={isOpen ? 'expand-less' : 'expand-more'} size={22} color={Colors.onSurfaceVariant} />
                </View>
                {isOpen && <Text style={styles.faqAnswer}>{f.a}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.ticketBtn} onPress={() => comingSoon('Raising a support ticket')}>
          <MaterialIcons name="confirmation-number" size={20} color={Colors.primary} />
          <Text style={styles.ticketText}>Raise a Support Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.marginMobile, paddingBottom: 100 },
  sectionTitle: { ...Typography.headlineSm, color: Colors.onSurface, marginBottom: Spacing.stackMd },
  list: { gap: Spacing.stackMd },
  contactCard: {
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryContainer + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactLabel: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.onSurface },
  contactSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  faqCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.DEFAULT,
    padding: Spacing.stackMd,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { ...Typography.bodyMd, fontFamily: 'WorkSans-Medium', color: Colors.onSurface, flex: 1, marginRight: 8 },
  faqAnswer: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 8, lineHeight: 20 },
  ticketBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.stackLg,
    height: 52,
    borderRadius: BorderRadius.DEFAULT,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ticketText: { ...Typography.bodyMd, fontFamily: 'WorkSans-SemiBold', color: Colors.primary },
});
