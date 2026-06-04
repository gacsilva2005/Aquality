import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Use o atalho @/ para evitar problemas de caminho (../)
import { UserProvider } from "@/src/contexts/UserContext"; 
import { AlertProvider } from '@/src/contexts/alertContext';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AlertProvider>
    <UserProvider>
      {/* Esconde o cabeçalho para TUDO que estiver na raiz (login, cadastro, etc) */}
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
    </AlertProvider>
  );
}