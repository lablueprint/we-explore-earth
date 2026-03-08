//STANDARD LIBRARY
import { useEffect, useState } from 'react';
//THIRD-PARTY LIBRARIES
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
//LOCAL FILES
import { store } from './redux/store';

export default function RootLayout() {
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
