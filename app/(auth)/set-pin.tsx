import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { PinKeypad, PinDots } from '../../components/ui/PinKeypad';
import { setPin as persistPin, setSessionActive } from '../../services/auth';

const PIN_LENGTH = 4;

export default function SetPinScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<'create' | 'confirm'>('create');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPinValue] = useState('');
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleComplete = async (value: string) => {
    if (stage === 'create') {
      setFirstPin(value);
      setStage('confirm');
      setPinValue('');
      setError(false);
      return;
    }

    // Confirm stage
    if (value !== firstPin) {
      setError(true);
      Alert.alert('PIN Mismatch', "The PINs you entered don't match. Please set your PIN again.");
      setStage('create');
      setFirstPin('');
      setPinValue('');
      return;
    }

    setSaving(true);
    try {
      await persistPin(value);
      await setSessionActive(true);
      router.replace('/(app)/home');
    } catch (e) {
      setSaving(false);
      Alert.alert('Something went wrong', 'Could not save your PIN. Please try again.');
      setStage('create');
      setFirstPin('');
      setPinValue('');
    }
  };

  const title = stage === 'create' ? 'Set a 4-digit PIN' : 'Confirm your PIN';
  const subtitle =
    stage === 'create'
      ? 'Use this PIN for quick, secure access to Bob World'
      : 'Re-enter the same PIN to confirm';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <View style={styles.topBlob} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="password" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.form}>
            <PinDots length={PIN_LENGTH} filled={pin.length} error={error && stage === 'create'} />
            <PinKeypad
              pin={pin}
              maxLength={PIN_LENGTH}
              onChangePin={setPinValue}
              onComplete={handleComplete}
              disabled={saving}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBlob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primaryFixed + '4D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    marginTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryContainer + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackSm,
    ...Shadows.low,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  form: {
    alignItems: 'center',
  },
});
