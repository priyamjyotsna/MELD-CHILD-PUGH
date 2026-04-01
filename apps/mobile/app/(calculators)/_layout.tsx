import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function CalculatorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.backgroundPage },
        headerTintColor: Colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.backgroundPage },
      }}
    />
  );
}
