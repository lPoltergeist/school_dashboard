import { useHaptic } from '@/hooks/use-haptics';
import { School } from '@features/Schools/types/school';
import { Box, Button, ButtonText, HStack, Text, VStack } from '@gluestack-ui/themed';
import { RelativePathString, router } from 'expo-router';
import React from 'react';

interface SchoolCardProps {
  item: School;
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
}

export const SchoolCard = React.memo(({ item, onEdit, onDelete }: SchoolCardProps) => {
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
          {item.address}
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
            Total de turmas: {item.classroomCount}
          </Text>
        </Box>
      </VStack>

      <HStack
        gap="$2"
        borderTopWidth={1}
        borderColor="$borderLight50"
        pt="$4"
      >
        <Button
          flex={1}
          size="sm"
          variant="outline"
          borderColor="$borderLight200"
          bg="$backgroundLight50"
          borderRadius="$lg"
          onPress={() => {
            trigger('light');
            onEdit(item);
          }}
        >
          <ButtonText color="$textLight600" fontWeight="$bold">
            Editar
          </ButtonText>
        </Button>

        <Button
          flex={1}
          size="sm"
          bg="$emerald500"
          borderRadius="$lg"
          onPress={() => {
            trigger('light');
            router.push(`/classes/${item.id}` as RelativePathString);
          }}
        >
          <ButtonText color="$white" fontWeight="$bold">
            Turmas
          </ButtonText>
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
});

SchoolCard.displayName = 'SchoolCard';
