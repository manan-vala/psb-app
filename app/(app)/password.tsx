import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBalance } from '../../context/BalanceContext';
import { verifyPassword } from '../../services/auth';

export default function PasswordScreen() {
  const router = useRouter();
  const { amount, payeeName } = useLocalSearchParams<{ amount: string, payeeName: string }>();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { updateBalance } = useBalance();

  const handleConfirm = () => {
    if (!password) {
      Alert.alert('Error', 'Please enter your password to proceed.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const isValid = await verifyPassword(password);
      if (!isValid) {
        setLoading(false);
        Alert.alert('Incorrect Password', 'Please enter your Bob World account password.');
        return;
      }

      setLoading(false);
      updateBalance(parseFloat(amount));
      router.push({ pathname: '/(app)/success', params: { amount, payeeName } });
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <TopAppBar 
        title="Enter Password"
        showBackIcon 
        onBackPress={() => router.back()} 
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.headerArea}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="lock" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Confirm Transfer</Text>
            <Text style={styles.headerSubtitle}>
              You are about to send ₹{amount} to {payeeName || 'Unknown Payee'}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Input
              label="Password"
              placeholder="Enter your Bob World password"
              leadingIcon="lock"
              isPassword
              value={password}
              onChangeText={setPassword}
            />
          </View>

        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Button 
            label="Send Payment" 
            icon="send" 
            onPress={handleConfirm} 
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.marginMobile,
    flexGrow: 1,
  },
  headerArea: {
    alignItems: 'center',
    paddingVertical: Spacing.stackLg,
    marginBottom: Spacing.stackMd,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackMd,
  },
  headerTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  formSection: {
    marginTop: Spacing.stackLg,
  },
  footer: {
    padding: Spacing.marginMobile,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceVariant + '80',
    backgroundColor: Colors.surfaceContainerLowest,
  },
});
