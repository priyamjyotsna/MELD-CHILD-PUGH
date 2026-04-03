import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.backgroundPage },
          headerTintColor: Colors.brandNavy,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
            color: Colors.brandNavy,
          },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: Colors.backgroundPage },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'MELD family scores', headerShown: false }} />
        <Stack.Screen
          name="(calculators)/liver-enzymes"
          options={{ title: 'Liver Enzyme Checker', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="(calculators)/fibroscan"
          options={{ title: 'FibroScan Interpreter', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="(calculators)/meld"
          options={{ title: 'MELD Score Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="(calculators)/child-pugh"
          options={{ title: 'Child-Pugh Calculator', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="results/enzyme-result"
          options={{ presentation: 'modal', title: 'Enzyme Results', headerShown: false }}
        />
        <Stack.Screen
          name="results/fibroscan-result"
          options={{ presentation: 'modal', title: 'FibroScan Results', headerShown: false }}
        />
        <Stack.Screen
          name="results/meld-result"
          options={{ presentation: 'modal', title: 'Results', headerShown: false }}
        />
        <Stack.Screen
          name="results/child-pugh-result"
          options={{ presentation: 'modal', title: 'Results', headerShown: false }}
        />
        <Stack.Screen
          name="about"
          options={{ title: 'About & References', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="disclaimer"
          options={{ presentation: 'modal', title: 'Medical Disclaimer', headerShown: false }}
        />
      </Stack>
    </>
  );
}
