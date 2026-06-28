import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from '../hooks/useFonts';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TelemetryProvider } from '../context/TelemetryContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  console.log("RootLayout render, fontsLoaded:", fontsLoaded);

  useEffect(() => {
    if (fontsLoaded) {
      console.log("Hiding Splash Screen...");
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TelemetryProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          {/* Fallback for index to redirect to auth. Currently we just rely on expo-router index if exists. */}
        </Stack>
      </TelemetryProvider>
    </SafeAreaProvider>
  );
}
