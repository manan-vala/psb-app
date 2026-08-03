import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows, BorderRadius } from '../../constants/theme';

// Utility to shuffle an array (keeps the keypad layout randomized each time
// it mounts, matching the original login screen's anti-shoulder-surfing behavior).
function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

interface PinDotsProps {
  length: number;
  filled: number;
  error?: boolean;
}

export function PinDots({ length, filled, error }: PinDotsProps) {
  return (
    <View style={dotStyles.container}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            dotStyles.dot,
            filled > index ? (error ? dotStyles.dotError : dotStyles.dotFilled) : null,
          ]}
        />
      ))}
    </View>
  );
}

interface PinKeypadProps {
  pin: string;
  maxLength?: number;
  onChangePin: (pin: string) => void;
  onComplete?: (pin: string) => void;
  disabled?: boolean;
}

export function PinKeypad({ pin, maxLength = 4, onChangePin, onComplete, disabled }: PinKeypadProps) {
  const [keypadNumbers, setKeypadNumbers] = useState<number[]>([]);

  useEffect(() => {
    setKeypadNumbers(shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  }, []);

  const handleKeyPress = (digit: number) => {
    if (disabled || pin.length >= maxLength) return;
    const newPin = pin + digit;
    onChangePin(newPin);
    if (newPin.length === maxLength) {
      onComplete?.(newPin);
    }
  };

  const handleBackspace = () => {
    if (disabled || pin.length === 0) return;
    onChangePin(pin.slice(0, -1));
  };

  if (keypadNumbers.length === 0) return null;

  return (
    <View style={styles.keypadContainer}>
      <View style={styles.keypadRow}>
        <KeypadButton value={keypadNumbers[0]} onPress={() => handleKeyPress(keypadNumbers[0])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[1]} onPress={() => handleKeyPress(keypadNumbers[1])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[2]} onPress={() => handleKeyPress(keypadNumbers[2])} disabled={disabled} />
      </View>
      <View style={styles.keypadRow}>
        <KeypadButton value={keypadNumbers[3]} onPress={() => handleKeyPress(keypadNumbers[3])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[4]} onPress={() => handleKeyPress(keypadNumbers[4])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[5]} onPress={() => handleKeyPress(keypadNumbers[5])} disabled={disabled} />
      </View>
      <View style={styles.keypadRow}>
        <KeypadButton value={keypadNumbers[6]} onPress={() => handleKeyPress(keypadNumbers[6])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[7]} onPress={() => handleKeyPress(keypadNumbers[7])} disabled={disabled} />
        <KeypadButton value={keypadNumbers[8]} onPress={() => handleKeyPress(keypadNumbers[8])} disabled={disabled} />
      </View>
      <View style={styles.keypadRow}>
        <View style={styles.keypadButtonEmpty} />
        <KeypadButton value={keypadNumbers[9]} onPress={() => handleKeyPress(keypadNumbers[9])} disabled={disabled} />
        <TouchableOpacity
          style={styles.keypadButton}
          onPress={handleBackspace}
          disabled={disabled || pin.length === 0}
        >
          <MaterialIcons name="backspace" size={28} color={pin.length > 0 ? Colors.onSurface : Colors.outline} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function KeypadButton({ value, onPress, disabled }: { value: number; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity style={styles.keypadButton} onPress={onPress} disabled={disabled}>
      <Text style={styles.keypadButtonText}>{value}</Text>
    </TouchableOpacity>
  );
}

const dotStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.outline,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dotError: {
    borderColor: Colors.error,
    backgroundColor: Colors.error,
  },
});

const styles = StyleSheet.create({
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
});
