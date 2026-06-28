import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  leadingIcon?: keyof typeof MaterialIcons.glyphMap;
  isPassword?: boolean;
  onFocusCapture?: () => void;
  onChangeTextCapture?: (value: string) => void;
}

export function Input({ label, leadingIcon, isPassword, style, onFocusCapture, onChangeTextCapture, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {leadingIcon && (
          <MaterialIcons name={leadingIcon} size={24} color={Colors.secondary} style={styles.leadingIcon} />
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.onSurfaceVariant + '80'}
          onFocus={() => {
            setIsFocused(true);
            onFocusCapture?.();
          }}
          onBlur={() => setIsFocused(false)}
          onChangeText={(text) => {
            onChangeTextCapture?.(text);
            if (props.onChangeText) props.onChangeText(text);
          }}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.trailingIcon}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40', // 20% opacity approx
    borderRadius: BorderRadius.DEFAULT,
    height: 56,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
    paddingHorizontal: 15, // adjust for border width change
  },
  leadingIcon: {
    marginRight: 12,
  },
  trailingIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    ...Typography.bodyMd,
    color: Colors.onSurface,
    height: '100%',
  },
});
