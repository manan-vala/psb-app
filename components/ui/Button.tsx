import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { Colors, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: keyof typeof MaterialIcons.glyphMap;
  loading?: boolean;
}

export function Button({ label, variant = 'primary', icon, loading, disabled, style, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? Colors.onPrimary : Colors.primary} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={24}
              color={isPrimary ? Colors.onPrimary : isSecondary ? Colors.secondary : Colors.primary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              isPrimary && styles.textPrimary,
              isSecondary && styles.textSecondary,
              isGhost && styles.textGhost,
              disabled && styles.textDisabled,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: BorderRadius.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.high,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    ...Typography.headlineSm,
  },
  textPrimary: {
    color: Colors.onPrimary,
  },
  textSecondary: {
    color: Colors.secondary,
  },
  textGhost: {
    color: Colors.primary,
  },
  textDisabled: {
    color: Colors.onSurfaceVariant,
  },
});
