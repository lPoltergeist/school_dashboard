import { School } from '@/features/Schools/types/school';
import { useHaptic } from '@/hooks/use-haptics';
import { useSchoolsStore } from '@features/Schools/store/useSchoolStore';
import {
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SchoolModal() {
  const router = useRouter();
  const { selectedSchool, updateSchool, createSchool, clearSelectedSchool } =
    useSchoolsStore();

  const [name, setName] = useState(selectedSchool?.name || '');
  const [address, setAddress] = useState(selectedSchool?.address || '');

  const { trigger } = useHaptic();

  const backgroundButtonColor = '#059669'

  const handleSave = async () => {
    if (!name || !address) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const schoolData = { name, address: address };

    if (selectedSchool) {
      await updateSchool(selectedSchool.id, schoolData);
    } else {
      await createSchool(schoolData as Omit<School, 'id'>);
    }

    clearSelectedSchool();
    router.back();
  };

  const handleGoBack = () => {
    clearSelectedSchool();
    router.back();
  };

  return (
    <Box flex={1} bg="$white" p="$6">
      <VStack space="lg">
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Nome da Escola</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField value={name} onChangeText={setName} />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Endereço</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField value={address} onChangeText={setAddress} />
          </Input>
        </FormControl>

        <Button
          onPress={() => {
            (trigger('success'), handleSave());
          }}
          bgColor={backgroundButtonColor}
          mt="$4"
        >
          <ButtonText>Salvar Escola</ButtonText>
        </Button>
        <Button
          onPress={() => {
            (trigger('light'), handleGoBack());
          }}
          bgColor={backgroundButtonColor}
          mt="$4"
        >
          <ButtonText>Voltar</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
