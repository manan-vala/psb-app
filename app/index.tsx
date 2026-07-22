import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking, AppState, AppStateStatus } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';
import { Button } from '../components/ui/Button';

export default function EntryScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAndRequestPermission = async () => {
    try {
      setLoading(true);
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);

      if (status === Location.PermissionStatus.GRANTED) {
        // Automatically redirect if granted
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAndRequestPermission();

    // Listen for app state changes to re-check permissions if user returns from settings
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const { status } = await Location.getForegroundPermissionsAsync();
        setStatus(status);
        if (status === Location.PermissionStatus.GRANTED) {
          router.replace('/(auth)/login');
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleGrantPermission = async () => {
    // If it was denied before, requestForegroundPermissionsAsync might return denied immediately without prompting.
    // In that case (or if they permanently denied it), we guide them to settings.
    const { status: currentStatus, canAskAgain } = await Location.getForegroundPermissionsAsync();
    
    if (!canAskAgain || currentStatus === Location.PermissionStatus.DENIED) {
      // Direct user to OS settings
      Linking.openSettings();
    } else {
      checkAndRequestPermission();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Only render the blocked screen if we are not loading and permission is not granted
  return (
    <View style={styles.container}>
      {/* Decorative Blob */}
      <View style={styles.blob} />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <MaterialIcons name="location-off" size={48} color={Colors.error} />
        </View>
        
        <Text style={styles.title}>Location Required</Text>
        <Text style={styles.description}>
          For security and fraud detection purposes, Bob World requires access to your device's location to proceed.
        </Text>
        
        <View style={styles.actionContainer}>
          <Button 
            label="Grant Permission" 
            onPress={handleGrantPermission}
            icon="location-on"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  blob: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.errorContainer + '40', // light error color
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginMobile,
    marginTop: 40,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.stackLg,
    ...Shadows.low,
  },
  title: {
    ...Typography.displayMd,
    color: Colors.onSurface,
    marginBottom: Spacing.stackSm,
    textAlign: 'center',
  },
  description: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: Spacing.stackXl,
    paddingHorizontal: 16,
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: 20,
  }
});
