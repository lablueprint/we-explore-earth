//STANDARD LIBRARY
import { useEffect, useState } from 'react';
//THIRD-PARTY LIBRARIES
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
//LOCAL FILES
import { store } from './redux/store';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'LibreBaskerville-Regular': require('../../shared/fonts/LibreBaskerville-Regular.ttf'),
    'HankenGrotesk-Regular': require('../../shared/fonts/HankenGrotesk-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

 return (
    <Provider store={store}>
      <Stack 
      screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(users)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </Provider>
  );
}
