import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import * as IntentLauncher from 'expo-intent-launcher';
import { Platform } from 'react-native';

export default function BlockedScreen() {
  const handleOpenSettings = () => {
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.VPN_SETTINGS);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="vpn-lock" size={64} color={Colors.error} />
      </View>
      <Text style={styles.title}>VPN Detected</Text>
      <Text style={styles.subtitle}>
        For your security, we do not allow access to the application while a VPN is active.
      </Text>
      <Text style={styles.instruction}>
        Please turn off your VPN in your device settings to continue using the app.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          label="Open Settings" 
          icon="settings" 
          onPress={handleOpenSettings}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.marginMobile,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackLg,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.onSurface,
    marginBottom: Spacing.stackSm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.stackLg,
    paddingHorizontal: 16,
  },
  instruction: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 32,
  },
});
