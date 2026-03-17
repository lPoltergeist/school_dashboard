import { Box, Center, Heading, SearchIcon, Spinner, Text, VStack } from '@gluestack-ui/themed';
import { Alert } from 'react-native';
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

import { useDebounce } from '@/hooks/use-debounce';
import { useHaptic } from '@/hooks/use-haptics';
import { ListEmptyComponent } from '@/utils/emptyList';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Box bg="$white" px="$4" pb="$4" pt="$2" borderBottomWidth={1} borderColor="$borderLight100">
        <VStack space="xs">
          <Heading size="2xl" color="$emerald900" fontWeight="$extrabold">
            Turmas
          </Heading>
          <Text size="md" color="$textLight500">
            Gerencie as turmas desta instituição
          </Text>
        </VStack>
      </Box>

      <Box px="$4" py="$3">
        <Input variant="outline" size="xl" bg="$white" borderRadius="$xl" alignItems="center"
          justifyContent="center">
          <InputIcon ml="$3" as={SearchIcon} color="$emerald600" />
          <InputField
            placeholder="Pesquisar turma pelo nome..."
            value={search}
            onChangeText={setSearch}
          />
        </Input>
      </Box>

      {isLoading ? (
        <Center flex={1}>
          <Spinner size="large" color="$emerald500" />
        </Center>
      ) : (
        <FlashList
          data={classes}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item) => item.id}
          removeClippedSubviews={true}
        />
      )}

    </SafeAreaView>
  );
}
