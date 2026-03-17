import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="[schoolId]" options={{ title: 'Turmas' }} />
      <Stack.Screen
        name="classroom-modal"
        options={{ title: 'Adicionar Turma' }}
      />
    </Stack>
  );
}
