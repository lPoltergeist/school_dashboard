import { ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { School } from '@/features/Schools/types/school';
import { SchoolCard } from '@features/Schools/components/SchoolCard';
import { useSchoolsStore } from '@features/Schools/store/useSchoolStore';
import { ListScreenStyles } from '@features/Schools/styles/SchoolListScreen.style';
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

import { useDebounce } from '@/hooks/debounced-filter';
import { useHaptic } from '@/hooks/use-hapitics';
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
    <SafeAreaView style={ListScreenStyles.container}>
      <Input variant="outline" size="md" margin={16}>
        <InputIcon ml="$3" />
        <InputField
          placeholder="Pesquisar escola pelo nome..."
          value={search}
          onChangeText={setSearch}
        />
      </Input>

      {isLoading ? (
        <ActivityIndicator size="large" color="#2563Eb" style={{ flex: 1 }} />
      ) : (
        <FlashList
          data={schools}
          renderItem={renderItem}
          contentContainerStyle={ListScreenStyles.listContent}
          showsVerticalScrollIndicator={false}
          getItemType={(item) => item.id}
          keyExtractor={(item) => item.id}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}
