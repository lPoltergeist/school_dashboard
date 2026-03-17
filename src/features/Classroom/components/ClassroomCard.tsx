import { useHaptic } from '@/hooks/use-haptics';
import { ClassroomCardStyles } from '@features/Classroom/styles/ClassroomCard.styles';
import { Classroom } from '@features/Classroom/types/class';
import { Box, Button, Text } from '@gluestack-ui/themed';
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
        borderColor="$borderLight200"
        style={ClassroomCardStyles.cardContainer}
      >
        <Box>
          <Text style={ClassroomCardStyles.classroomName}>{item.name}</Text>
          <Text style={ClassroomCardStyles.classroomAddress}>{item.shift}</Text>
          <Box style={ClassroomCardStyles.classroomBadge}>
            <Text style={ClassroomCardStyles.classroomBadgeText}>
              Ano letivo: {item.school_year}
            </Text>
          </Box>
        </Box>

        <Box style={ClassroomCardStyles.cardActions}>
          <Button
            style={[
              ClassroomCardStyles.button,
              ClassroomCardStyles.buttonDelete,
            ]}
            onPress={() => {
              (trigger('heavy'), onDelete(item.id));
            }}
          >
            <Text
              style={[
                ClassroomCardStyles.buttonDeleteText,
                ClassroomCardStyles.buttonText,
              ]}
            >
              Deletar
            </Text>
          </Button>

          <Button
            style={[
              ClassroomCardStyles.button,
              ClassroomCardStyles.buttonPrimary,
            ]}
            onPress={() => {
              (trigger('light'), onEdit(item));
            }}
          >
            <Text
              style={[
                ClassroomCardStyles.buttonPrimaryText,
                ClassroomCardStyles.buttonText,
              ]}
            >
              Editar Turma
            </Text>
          </Button>
        </Box>
      </Box>
    );
  },
);

ClassroomCard.displayName = 'ClassroomCard';
