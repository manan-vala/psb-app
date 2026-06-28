import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTelemetry } from '../../context/TelemetryContext';

// Simple UUID generator for the demo session
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    keystrokeInputProps,
    pasteHandlers,
    startGyroSampling,
    stopGyroSampling,
    submitTelemetry,
  } = useTelemetry();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const sessionId = generateSessionId();
      const userId = 'user_123'; // Hardcoded for demo
      
      const assessment = await submitTelemetry(userId, sessionId);

      if (assessment.action === 'ALLOW') {
        router.replace('/(app)/home');
      } else if (assessment.action === 'STEP_UP') {
        // Show BiometricModal (always resolves true in demo)
        // For now, pass through
        router.replace('/(app)/home');
      } else {
        // BLOCK
        router.push({ pathname: '/(auth)/blocked', params: { reason: assessment.explanation } });
      }
    } catch (err) {
      // API unreachable -> fail open for demo
      console.warn('Telemetry API unreachable, failing open', err);
      router.replace('/(app)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Decorative Background Gradients */}
        <View style={styles.topBlob} />
        
        {/* Main Content (pushed down) */}
        <View style={styles.content}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="account-balance" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>bob World</Text>
            <Text style={styles.subtitle}>Welcome back</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Customer ID / Mobile Number"
              placeholder="Enter your ID or number"
              leadingIcon="person"
              autoCapitalize="none"
              keyboardType="default"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              leadingIcon="lock"
              isPassword
              {...keystrokeInputProps()}
              onFocusCapture={() => {
                pasteHandlers.onFocusCapture();
                startGyroSampling();
              }}
              onChangeTextCapture={pasteHandlers.onChangeTextCapture}
              onBlur={stopGyroSampling}
            />
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button label="Login" onPress={handleLogin} loading={loading} />
            
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              label="Login with Biometrics"
              variant="secondary"
              icon="fingerprint"
              onPress={handleLogin}
              disabled={loading}
            />
          </View>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLink}>Need Help?</Text>
          <Text style={styles.footerDot}>•</Text>
          <Text style={styles.footerLink}>Security Tips</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.stackLg,
  },
  topBlob: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.primaryFixed + '4D', // 30% opacity
  },
  content: {
    flex: 1,
    justifyContent: 'center',
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
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackSm,
    ...Shadows.low,
  },
  title: {
    ...Typography.displayLg,
    color: Colors.primary,
  },
  subtitle: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
  },
  form: {
    marginBottom: Spacing.stackLg,
  },
  forgotPassword: {
    ...Typography.labelMd,
    color: Colors.primary,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 16,
  },
  actions: {
    gap: Spacing.stackMd,
    marginBottom: Spacing.stackLg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant + '40',
  },
  dividerText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    paddingHorizontal: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.stackMd,
  },
  footerLink: {
    ...Typography.bodySm,
    color: Colors.secondary,
    fontFamily: 'WorkSans-Medium',
  },
  footerDot: {
    ...Typography.bodySm,
    color: Colors.secondary,
    marginHorizontal: 8,
  },
});
