import { Box, Icon, SearchIcon, Text } from "@gluestack-ui/themed/build/components";

export const ListEmptyComponent = () => (
    <Box flex={1} justifyContent="center" alignItems="center" p="$10" mt="$20">
        <Icon as={SearchIcon} size="xl" color="#10B981" mb="$4" />
        <Text color="#064E3B" fontWeight="bold">Nenhum resultado encontrado</Text>
        <Text color="#64748B" textAlign="center">Tente mudar o termo da busca ou cadastrar um novo item.</Text>
    </Box>
);