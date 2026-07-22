import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { Button } from '../../components/ui/Button';

export default function ConfirmScreen() {
  const router = useRouter();
  const { amount, payeeName } = useLocalSearchParams<{ amount: string, payeeName: string }>();
  const insets = useSafeAreaInsets();

  const numericAmount = parseFloat(amount || '0');
  const isLargeTransfer = numericAmount > 10000;
  
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (isLargeTransfer) {
      const timer = setTimeout(() => {
        Alert.alert('SMS Notification', 'Your BOB World OTP is 1234. Do not share this with anyone.');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLargeTransfer]);

  const handleConfirm = () => {
    if (isLargeTransfer && otp !== '1234') {
      Alert.alert('Verification Failed', 'Please enter the correct OTP sent to your registered mobile number.');
      return;
    }
    router.push({ pathname: '/(app)/password', params: { amount, payeeName } });
  };

  return (
    <View style={styles.container}>
      <TopAppBar 
        title="Confirm Payment"
        showBackIcon 
        onBackPress={() => router.back()} 
      />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        
        {/* Decorative Header */}
        <View style={styles.headerArea}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="payments" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.headerSubtitle}>You are paying</Text>
          <Text style={styles.headerTitle} adjustsFontSizeToFit numberOfLines={2}>{payeeName || 'Unknown Payee'}</Text>
        </View>

        {/* Transaction Details Card */}
        <View style={styles.card}>
          <View style={styles.cardTopGradient} />
          
          <View style={styles.amountSection}>
            <Text style={styles.amountValue} adjustsFontSizeToFit numberOfLines={1}>₹ {numericAmount.toFixed(2)}</Text>
            <Text style={styles.amountLabel}>Total Amount</Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payee Name</Text>
              <Text style={[styles.detailValue, { flexShrink: 1, textAlign: 'right', marginLeft: 16 }]} numberOfLines={2}>{payeeName || 'Unknown Payee'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction Date</Text>
              <Text style={styles.detailValue}>Today, Oct 29</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transfer Method</Text>
              <View style={styles.methodValue}>
                <MaterialIcons name="account-balance" size={18} color={Colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.detailValue}>Bank Account (...4321)</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailValue}>₹ 0.00</Text>
            </View>
          </View>

          <View style={styles.securityBadge}>
            <MaterialIcons name="lock" size={16} color={Colors.secondary} style={{ marginRight: 6 }} />
            <Text style={styles.securityText}>Secure 256-bit Encryption</Text>
          </View>
        </View>

        {/* OTP Section for large transfers */}
        {isLargeTransfer && (
          <View style={styles.otpContainer}>
            <View style={styles.warningBanner}>
              <MaterialIcons name="security" size={20} color={Colors.error} />
              <Text style={styles.warningText}>OTP required for transfers over ₹10,000</Text>
            </View>
            <Text style={styles.noteLabel}>Enter OTP</Text>
            <View style={styles.noteInputContainer}>
              <TextInput
                style={styles.noteInput}
                value={otp}
                onChangeText={setOtp}
                placeholder="Enter 4-digit OTP"
                keyboardType="number-pad"
                maxLength={4}
              />
              <MaterialIcons name="dialpad" size={20} color={Colors.secondary + '80'} />
            </View>
          </View>
        )}

        {/* Note (Disabled) */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Note (Optional)</Text>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              value="Dinner last night"
              editable={false}
            />
            <MaterialIcons name="edit" size={20} color={Colors.secondary + '80'} />
          </View>
        </View>

        </ScrollView>
      </KeyboardAvoidingView>


      {/* Floating Action Bar */}
      <View style={[styles.floatingActionBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button 
          label="Confirm Payment" 
          icon="check-circle" 
          onPress={handleConfirm} 
          style={{ marginBottom: 12 }}
        />
        <Button 
          label="Cancel" 
          variant="ghost" 
          onPress={() => router.back()} 
          style={{ height: 48 }}
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.marginMobile,
    paddingBottom: 160, // Make room for floating action bar
  },
  headerArea: {
    alignItems: 'center',
    paddingVertical: Spacing.stackMd,
    marginBottom: Spacing.stackMd,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackSm,
    ...Shadows.low,
  },
  headerSubtitle: {
    ...Typography.bodySm,
    color: Colors.secondary,
  },
  headerTitle: {
    ...Typography.headlineLgMobile,
    color: Colors.onSurface,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '33',
    ...Shadows.low,
    marginBottom: Spacing.stackLg,
  },
  cardTopGradient: {
    height: 4,
    backgroundColor: Colors.primary, // Using primary for simplicity instead of linear gradient in React Native (unless expo-linear-gradient is added, but primary works fine)
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: Spacing.stackLg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  amountValue: {
    ...Typography.displayLg,
    color: Colors.primary,
  },
  amountLabel: {
    ...Typography.labelMd,
    color: Colors.tertiary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  detailsSection: {
    padding: Spacing.stackMd,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
  },
  detailValue: {
    ...Typography.bodyMd,
    fontFamily: 'WorkSans-Medium',
    color: Colors.onSurface,
  },
  methodValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant,
  },
  securityText: {
    ...Typography.labelMd,
    color: Colors.secondary,
  },
  noteContainer: {
    marginBottom: Spacing.stackLg,
  },
  noteLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
    paddingLeft: 4,
  },
  noteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.secondary + '33',
    borderRadius: BorderRadius.DEFAULT,
    paddingHorizontal: 16,
    height: 48,
  },
  noteInput: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  floatingActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.marginMobile,
    paddingTop: Spacing.stackMd,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant + '80',
    backgroundColor: Colors.surface,
  },
  otpContainer: {
    marginBottom: Spacing.stackLg,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorContainer,
    padding: 12,
    borderRadius: BorderRadius.DEFAULT,
    marginBottom: 16,
  },
  warningText: {
    ...Typography.bodySm,
    color: Colors.onErrorContainer,
    marginLeft: 8,
    flex: 1,
  },
});
