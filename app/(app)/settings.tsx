import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { TopAppBar } from '../../components/ui/TopAppBar';

export default function SettingsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <View style={styles.container}>
      <TopAppBar 
        title="Settings"
        showMenuIcon 
        onMenuPress={() => navigation.openDrawer()} 
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Attack Panel Placeholder</Text>
        <Text style={styles.body}>This screen is reserved for the Attack Panel where we can toggle risks and bypass defenses during the demonstration.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: Spacing.marginMobile,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
    marginBottom: Spacing.stackMd,
  },
  body: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
