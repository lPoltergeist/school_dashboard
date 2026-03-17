import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="[schoolId]" options={{ title: 'Escola' }} />
      <Stack.Screen
        name="school-modal"
        options={{ title: 'Adicionar Escola' }}
      />
    </Stack>
  );
}
