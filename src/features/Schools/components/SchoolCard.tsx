import { useHaptic } from '@/hooks/use-hapitics';
import { CardStyles } from '@features/Schools/styles/SchoolCard.style';
import { School } from '@features/Schools/types/school';
import { Box, Button, Text } from '@gluestack-ui/themed';
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
      borderColor="$borderLight200"
    >
      <Box style={CardStyles.cardHeader}>
        <Text style={CardStyles.schoolName}>{item.name}</Text>
        <Text style={CardStyles.schoolAddress}>{item.address}</Text>
        <Box style={CardStyles.schoolBadge}>
          <Text style={CardStyles.schoolBadgeText}>
            Total de turmas: {item.classroomCount}
          </Text>
        </Box>
      </Box>

      <Box style={CardStyles.cardActions}>
        <Button
          style={[CardStyles.button, CardStyles.buttonSecondary]}
          onPress={() => {
            (trigger('light'), onEdit(item));
          }}
        >
          <Text style={[CardStyles.buttonSecondaryText, CardStyles.buttonText]}>
            Editar
          </Text>
        </Button>

        <Button
          style={[CardStyles.button, CardStyles.buttonPrimary]}
          onPress={() => {
            (trigger('light'),
              router.push(`/classes/${item.id}` as RelativePathString));
          }}
        >
          <Text style={[CardStyles.buttonPrimaryText, CardStyles.buttonText]}>
            Turmas
          </Text>
        </Button>

        <Button
          style={[CardStyles.button, CardStyles.buttonDelete]}
          onPress={() => {
            (trigger('heavy'), onDelete(item.id));
          }}
        >
          <Text style={[CardStyles.buttonDeleteText, CardStyles.buttonText]}>
            Deletar
          </Text>
        </Button>
      </Box>
    </Box>
  );
});

SchoolCard.displayName = 'SchoolCard';
