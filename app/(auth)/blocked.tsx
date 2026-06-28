import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

export default function BlockedScreen() {
  const router = useRouter();
  const { reason } = useLocalSearchParams<{ reason: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="gpp-bad" size={64} color={Colors.error} />
        </View>
        <Text style={styles.title}>Access Blocked</Text>
        <Text style={styles.subtitle}>
          {reason || 'Suspicious activity detected. Your session has been terminated to protect your account.'}
        </Text>
        
        <Button 
          label="Return to Login" 
          onPress={() => router.replace('/(auth)/login')}
          style={{ width: '100%', marginTop: Spacing.stackLg }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.marginMobile,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.stackMd,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.error,
    marginBottom: Spacing.stackSm,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: Spacing.stackLg,
  },
});
