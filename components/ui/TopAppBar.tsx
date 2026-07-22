import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '../../constants/theme';

interface TopAppBarProps {
  title?: string;
  showMenuIcon?: boolean;
  showBackIcon?: boolean;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
}

export function TopAppBar({
  title = 'Bob World',
  showMenuIcon,
  showBackIcon,
  onMenuPress,
  onBackPress,
  rightElement,
}: TopAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showMenuIcon && (
            <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
              <MaterialIcons name="menu" size={28} color={Colors.primary} />
            </TouchableOpacity>
          )}
          {showBackIcon && (
            <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
              <MaterialIcons name="arrow-back" size={28} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.right}>
          {rightElement}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHighest,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  left: {
    width: 48,
    alignItems: 'flex-start',
  },
  right: {
    width: 48,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 24,
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.primary,
    flex: 1,
    textAlign: 'center',
  },
});
