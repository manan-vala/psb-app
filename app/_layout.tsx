import React from 'react';
import { Stack } from 'expo-router';
import { useFonts } from '../hooks/useFonts';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      {/* Fallback for index to redirect to auth. Currently we just rely on expo-router index if exists. */}
    </Stack>
  );
}
