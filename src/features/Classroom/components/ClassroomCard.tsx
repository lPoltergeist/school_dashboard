import { useHaptic } from '@/hooks/use-haptics';
import { Classroom } from '@features/Classroom/types/class';
import { Box, Button, ButtonText, HStack, Text, VStack } from '@gluestack-ui/themed';
import React from 'react';

interface ClassroomCardProps {
  item: Classroom;
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: string) => void;
}

export const ClassroomCard = React.memo(
  ({ item, onEdit, onDelete }: ClassroomCardProps) => {
    const { trigger } = useHaptic();
    return (
      <Box
        bg="$white"
        p="$4"
        borderRadius="$xl"
        borderWidth={1}
        borderColor="$borderLight100"
        mb="$4"
        softShadow="1"
      >
        <VStack space="xs" mb="$4">
          <Text size="xl" fontWeight="$bold" color="$emerald900">
            {item.name}
          </Text>
          <Text size="sm" color="$textLight500">
            Turno: {item.shift}
          </Text>

          <Box
            bg="$emerald50"
            alignSelf="flex-start"
            px="$2"
            py="$1"
            borderRadius="$md"
            mt="$2"
          >
            <Text size="xs" fontWeight="$semibold" color="$emerald600">
              Ano letivo: {item.school_year}
            </Text>
          </Box>
        </VStack>

        <HStack
          flexDirection="row-reverse"
          gap="$3"
          borderTopWidth={1}
          borderColor="$borderLight50"
          pt="$4"
        >
          <Button
            flex={1}
            size="sm"
            bg="$emerald500"
            borderRadius="$lg"
            onPress={() => {
              trigger('light');
              onEdit(item);
            }}
          >
            <ButtonText fontWeight="$bold">Editar Turma</ButtonText>
          </Button>

          <Button
            flex={1}
            size="sm"
            variant="outline"
            action="negative"
            borderColor="$red200"
            bg="$red50"
            borderRadius="$lg"
            onPress={() => {
              trigger('heavy');
              onDelete(item.id);
            }}
          >
            <ButtonText color="$red600" fontWeight="$bold">
              Deletar
            </ButtonText>
          </Button>
        </HStack>
      </Box>
    );
  },
);

ClassroomCard.displayName = 'ClassroomCard';
