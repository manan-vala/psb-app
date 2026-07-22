import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import BobLogo from '../../assets/BOB-Iogo.svg';

// Utility to shuffle an array
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [keypadNumbers, setKeypadNumbers] = useState<number[]>([]);

  useEffect(() => {
    // Generate a shuffled array of digits 0-9 on mount
    setKeypadNumbers(shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  }, []);

  const handleKeyPress = (digit: number) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        handleLogin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleLogin = async (currentPin: string) => {
    setLoading(true);
    // Simulate API call for authentication
    setTimeout(() => {
      setLoading(false);
      // For demo purposes, we will accept any 4-digit PIN
      router.replace('/(app)/home');
    }, 1000);
  };

  const renderPinIndicator = () => {
    return (
      <View style={styles.pinIndicatorContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View 
            key={index} 
            style={[
              styles.pinDot,
              pin.length > index ? styles.pinDotFilled : null
            ]} 
          />
        ))}
      </View>
    );
  };

  const renderKeypad = () => {
    if (keypadNumbers.length === 0) return null;

    return (
      <View style={styles.keypadContainer}>
        <View style={styles.keypadRow}>
          <KeypadButton value={keypadNumbers[0]} onPress={() => handleKeyPress(keypadNumbers[0])} />
          <KeypadButton value={keypadNumbers[1]} onPress={() => handleKeyPress(keypadNumbers[1])} />
          <KeypadButton value={keypadNumbers[2]} onPress={() => handleKeyPress(keypadNumbers[2])} />
        </View>
        <View style={styles.keypadRow}>
          <KeypadButton value={keypadNumbers[3]} onPress={() => handleKeyPress(keypadNumbers[3])} />
          <KeypadButton value={keypadNumbers[4]} onPress={() => handleKeyPress(keypadNumbers[4])} />
          <KeypadButton value={keypadNumbers[5]} onPress={() => handleKeyPress(keypadNumbers[5])} />
        </View>
        <View style={styles.keypadRow}>
          <KeypadButton value={keypadNumbers[6]} onPress={() => handleKeyPress(keypadNumbers[6])} />
          <KeypadButton value={keypadNumbers[7]} onPress={() => handleKeyPress(keypadNumbers[7])} />
          <KeypadButton value={keypadNumbers[8]} onPress={() => handleKeyPress(keypadNumbers[8])} />
        </View>
        <View style={styles.keypadRow}>
          <View style={styles.keypadButtonEmpty} />
          <KeypadButton value={keypadNumbers[9]} onPress={() => handleKeyPress(keypadNumbers[9])} />
          <TouchableOpacity style={styles.keypadButton} onPress={handleBackspace} disabled={pin.length === 0}>
            <MaterialIcons name="backspace" size={28} color={pin.length > 0 ? Colors.onSurface : Colors.outline} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        {/* Decorative Background Gradients */}
        <View style={styles.topBlob} />
        
        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Header Section */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }]}>
              <BobLogo width={80} height={80} />
            </View>
            <Text style={styles.title}>Bob World</Text>
            <Text style={styles.subtitle}>Enter 4-digit PIN</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {renderPinIndicator()}
            {renderKeypad()}
            <TouchableOpacity onPress={() => setPin('')}>
              <Text style={styles.forgotPassword}>Forgot PIN?</Text>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button
              label="Login with Biometrics"
              variant="secondary"
              icon="fingerprint"
              onPress={() => handleLogin(pin)} // Demo behavior
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
    </View>
  );
}

// Sub-component for Keypad Buttons
function KeypadButton({ value, onPress }: { value: number; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.keypadButton} onPress={onPress}>
      <Text style={styles.keypadButtonText}>{value}</Text>
    </TouchableOpacity>
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
    marginTop: 8,
  },
  form: {
    marginBottom: Spacing.stackLg,
    alignItems: 'center',
  },
  pinIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  keypadContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
    marginBottom: 24,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  keypadButton: {
    flex: 1,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.low,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  keypadButtonEmpty: {
    flex: 1,
    height: 64,
  },
  keypadButtonText: {
    ...Typography.displayMd,
    color: Colors.onSurface,
  },
  forgotPassword: {
    ...Typography.labelMd,
    color: Colors.primary,
    marginTop: 16,
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
