import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { School } from '@/features/Schools/types/school';
import { SchoolCard } from '@features/Schools/components/SchoolCard';
import { useSchoolsStore } from '@features/Schools/store/useSchoolStore';
import { FlashList } from '@shopify/flash-list';
import {
  RelativePathString,
  useFocusEffect,
  useNavigation,
  useRouter,
} from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import { useHaptic } from '@/hooks/use-haptics';
import { ListEmptyComponent } from '@/utils/emptyList';
import { Box, Center, Heading, SearchIcon, Spinner, Text, VStack } from '@gluestack-ui/themed';
import {
  Input,
  InputField,
  InputIcon,
} from '@gluestack-ui/themed/build/components/Input';
import { HeaderCreateButton } from '@utils/addNew';

export default function SchoolListScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { trigger } = useHaptic();
  const { schools, isLoading, fetchSchools, setSelectedSchool, deleteSchool } =
    useSchoolsStore();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchSchools(debouncedSearch);
  }, [fetchSchools, debouncedSearch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderCreateButton
          path="schools/school-modal"
          label="Adicionar Escola"
        />
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchSchools();
    }, [fetchSchools]),
  );

  const handleEdit = React.useCallback(
    (school: School) => {
      setSelectedSchool(school);
      router.push('/schools/school-modal' as RelativePathString);
    },
    [router, setSelectedSchool],
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Escola',
      'Tem certeza? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            (trigger('heavy'), deleteSchool(id));
          },
        },
      ],
    );
  };

  const renderItem = React.useCallback(
    ({ item }: { item: School }) => (
      <SchoolCard item={item} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [handleEdit],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <Box bg="$white" px="$6" pb="$4" pt="$2" borderBottomWidth={1} borderColor="$borderLight100">
        <VStack space="xs">
          <Heading size="2xl" color="$emerald900" fontWeight="$extrabold">
            Escolas
          </Heading>
          <Text size="md" color="$textLight500">
            Gerencie as instituições de ensino
          </Text>
        </VStack>
      </Box>

      <Box px="$4" py="$3">
        <Input variant="outline" size="xl" bg="$white" borderRadius="$xl" alignItems="center"
          justifyContent="center">
          <InputIcon ml="$3" as={SearchIcon} color="$emerald600" />
          <InputField
            placeholder="Pesquisar escola pelo nome..."
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
          data={schools}
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
