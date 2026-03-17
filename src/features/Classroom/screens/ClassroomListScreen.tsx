import { Box, Text } from '@gluestack-ui/themed';
import { ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClassroomCard } from '@/features/Classroom/components/ClassroomCard';
import { useClassroomStore } from '@features/Classroom/store/useClassroomStore';
import { Classroom } from '@features/Classroom/types/class';
import { FlashList } from '@shopify/flash-list';
import { HeaderCreateButton } from '@utils/addNew';
import {
  RelativePathString,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import { ClassroomListStyles } from '@/features/Classroom/styles/ClassRoomListScreen.style';
import { useDebounce } from '@/hooks/debounced-filter';
import { useHaptic } from '@/hooks/use-hapitics';
import {
  Input,
  InputField,
  InputIcon,
} from '@gluestack-ui/themed/build/components/Input';

export default function ClassroomListScreen() {
  const navigation = useNavigation();
  const { trigger } = useHaptic();
  const { schoolId } = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const router = useRouter();
  const {
    classes,
    isLoading,
    fetchClasses,
    setSelectedClasses,
    deleteClasses,
  } = useClassroomStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderCreateButton
          path="classes/classroom-modal"
          label="Adicionar Turma"
          params={{ schoolId }}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    fetchClasses(schoolId, debouncedSearch);
  }, [fetchClasses, debouncedSearch, schoolId]);

  const handleEdit = React.useCallback(
    (classroom: Classroom) => {
      setSelectedClasses(classroom);
      router.push('/classes/classroom-modal' as RelativePathString);
    },
    [router, setSelectedClasses],
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Turma',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            (trigger('heavy'), deleteClasses(id));
          },
        },
      ],
    );
  };

  const renderItem = React.useCallback(
    ({ item }: { item: Classroom }) => (
      <ClassroomCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [handleEdit],
  );

  return (
    <SafeAreaView style={ClassroomListStyles.container}>
      <Box
        bg="$white"
        p="$4"
        borderRadius="$xl"
        borderWidth={1}
        borderColor="$borderLight200"
      >
        <Text style={ClassroomListStyles.title}>Turmas</Text>
        <Text style={ClassroomListStyles.subtitle}>
          Gerencie as suas turmas
        </Text>
      </Box>

      <Input variant="outline" size="md" margin={16}>
        <InputIcon ml="$3" />
        <InputField
          placeholder="Pesquisar turma pelo nome..."
          value={search}
          onChangeText={setSearch}
        />
      </Input>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563Eb" style={{ flex: 1 }} />
      ) : (
        <FlashList
          data={classes}
          renderItem={renderItem}
          contentContainerStyle={ClassroomListStyles.listContent}
          showsVerticalScrollIndicator={false}
          getItemType={(item) => item.id}
          keyExtractor={(item) => item.id}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}
