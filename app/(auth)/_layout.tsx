import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="register" />
      <Stack.Screen name="set-pin" />
      <Stack.Screen name="password-login" />
      <Stack.Screen name="login" />
      <Stack.Screen name="blocked" />
    </Stack>
  );
}
