import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import useImage from '@/hooks/useImage';
import { ModalProvider } from '@/providers/ModalContext';
import { SessionProvider, useSession } from '@/providers/SessionContext';
import { SnackbarProvider } from '@/providers/SnackbarContext';
import { initializeDb } from '@/services/SQLite';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import useLocations from '@/hooks/useLocations';
import useNetwork from '@/hooks/useNetwork';
import { ThemeProvider } from '@/providers/ThemeContext';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const InitialLayout = () => { 
  const { connectionStatus } = useNetwork() as { connectionStatus: any };
  const { requestPermissions } = useImage() as { requestPermissions: any };
  const { user, isLoading } = useSession() as { user: any, isLoading: any };
  const { syncLocationAfterNetwork } = useLocations() as { syncLocationAfterNetwork: any };
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    initializeDb();
    requestPermissions();
    console.log("Database inicalizado com sucesso");
  }, [])

  useEffect(() => {
    syncLocationAfterNetwork()
  }, [connectionStatus.isConnected, syncLocationAfterNetwork])

  useEffect(() => {
    if(isLoading && user == undefined) return;
    
    if(user === null) {
      if (path !== "/login" && path !== "/register") {
        router.replace("/login");
        return;
      }
    }  else{
      if (path === "/login" || path === "/register" ) {
        router.replace("/(tabs)");
        return;
      }
    }
  }, [user, isLoading])

  return <>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="location" options={{ headerShown: false }} />
            </Stack>
          <StatusBar style="auto" />
        </>
}

export default function RootLayout() {
  return  <SessionProvider>
              <ThemeProvider>
                <SafeAreaProvider>
                  <SnackbarProvider>
                      <ModalProvider>
                        <InitialLayout />
                      </ModalProvider>
                  </SnackbarProvider>
                </SafeAreaProvider>
              </ThemeProvider>
          </SessionProvider>
}
