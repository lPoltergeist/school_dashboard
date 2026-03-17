// components/HeaderCreateButton.tsx
import { useClassroomStore } from '@features/Classroom/store/useClassroomStore';
import { useSchoolsStore } from '@features/Schools/store/useSchoolStore';
import { RelativePathString, router } from 'expo-router';
import { Button } from 'react-native';

export const HeaderCreateButton = ({
  path,
  label,
  params,
}: {
  path: string;
  label: string;
  params?: any;
}) => {
  const handlePress = () => {
    if (path === 'schools/school-modal') {
      useSchoolsStore.getState().clearSelectedSchool();
    } else {
      useClassroomStore.getState().clearSelectedClasses();
    }
    router.push({ pathname: path as RelativePathString, params: params });
  };

  return <Button title={label} onPress={handlePress} />;
};
