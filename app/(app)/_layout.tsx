import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useRouter, usePathname } from 'expo-router';
import { BottomNavBar } from '../../components/ui/BottomNavBar';
import { DrawerContent } from '../../components/ui/DrawerContent';
import { useTelemetry } from '../../context/TelemetryContext';

export default function AppLayout() {
  const { isVpnActive } = useTelemetry();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isVpnActive && pathname !== '/blocked') {
      router.replace('/(app)/blocked');
    } else if (!isVpnActive && pathname === '/blocked') {
      router.replace('/(app)/home');
    }
  }, [isVpnActive, pathname]);

  return (
    <View style={styles.container}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '80%',
            maxWidth: 320,
          },
          drawerType: 'front', // slide over content
          overlayColor: 'rgba(48, 48, 48, 0.5)', // inverse-surface with 50% opacity (no blur natively in drawer yet, but this is close)
        }}
      >
        <Drawer.Screen name="home" />
        <Drawer.Screen name="transfer" />
        <Drawer.Screen name="pay" />
        <Drawer.Screen name="more" />
        <Drawer.Screen name="confirm" />
        <Drawer.Screen name="fixed-deposits" />
        <Drawer.Screen name="cards" />
        <Drawer.Screen name="loans" />
        <Drawer.Screen name="offers" />
        <Drawer.Screen name="support" />
        <Drawer.Screen name="settings" />
        <Drawer.Screen name="blocked" options={{ drawerItemStyle: { display: 'none' }, swipeEnabled: false }} />
      </Drawer>
      {/* Bottom Nav Bar placed outside the Drawer content so it stays fixed on all app screens */}
      {/* Actually, expo-router's Drawer wraps everything, so placing BottomNavBar here puts it at the absolute bottom of the screen */}
      {pathname !== '/blocked' && <BottomNavBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

