import { useHaptic } from '@/hooks/use-haptics';
import { useClassroomStore } from '@features/Classroom/store/useClassroomStore';
import { Classroom } from '@features/Classroom/types/class';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

export default function ClassroomModal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    selectedClasses,
    createClasses,
    updateClasses,
    clearSelectedClasses,
  } = useClassroomStore();

  const [name, setName] = useState(selectedClasses?.name || '');
  const [shift, setShift] = useState(selectedClasses?.shift || '');
  const [year, setYear] = useState(selectedClasses?.school_year || '');

  const { trigger } = useHaptic();

  const backgroundButtonColor = '#059669'

  const handleSave = async () => {
    if (!name || !shift || !year) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const classesData = {
      name,
      shift,
      school_year: year,
      schoolId: (selectedClasses
        ? selectedClasses.schoolId
        : params.schoolId) as string,
    };

    if (selectedClasses) {
      await updateClasses(selectedClasses.id, classesData);
    } else {
      await createClasses(classesData as Omit<Classroom, 'id'>);
    }

    clearSelectedClasses();
    router.back();
  };


  const handleGoBack = () => {
    clearSelectedClasses();
    router.back();
  };

  return (
    <Box flex={1} bg="$white" p="$6">
      <VStack space="lg">
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Turma</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField value={name} onChangeText={setName} />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Turno</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField value={shift} onChangeText={setShift} />
          </Input>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Ano Letivo</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              value={year}
              onChangeText={setYear}
              keyboardType="numeric"
            />
          </Input>
        </FormControl>

        <Button
          onPress={() => {
            (trigger('success'), handleSave());
          }}
          bgColor={backgroundButtonColor}
          mt="$4"
        >
          <ButtonText>Salvar Turma</ButtonText>
        </Button>
        <Button
          onPress={() => {
            (trigger('light'), handleGoBack());
          }}
          bgColor={backgroundButtonColor}
          collapsable
          mt="$4"
        >
          <ButtonText>Voltar</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
