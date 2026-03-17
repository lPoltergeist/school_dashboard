import {
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';

require('../msw.polyfills');
const { server } = require('../src/mocks/server');
server.listen({ onUnhandledRequest: 'bypass' });

export default function RootLayout() {

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaProvider>
        <GluestackUIProvider config={config}>
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: true,
            }}
          >
            <Stack.Screen name="index" options={{ title: 'Escolas' }} />
            <Stack.Screen name="classes" options={{ headerShown: false }} />
            <Stack.Screen name="schools" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </GluestackUIProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
