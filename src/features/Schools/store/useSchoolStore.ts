import { School } from '@features/Schools/types/school';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SchoolState {
  schools: School[];
  selectedSchool: School | null;
  setSelectedSchool: (school: School) => void;
  isLoading: boolean;

  fetchSchools: (name?: string, page?: number) => Promise<void>;
  fetchSchoolById: (id: string) => Promise<School | null>;
  clearSelectedSchool: () => void;
  createSchool: (school: Omit<School, 'id'>) => Promise<void>;
  updateSchool: (
    id: string,
    school: Partial<Omit<School, 'id'>>,
  ) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
}

const BASE_URL = 'http://192.168.1.109:3000';

export const useSchoolsStore = create<SchoolState>()(
  persist(
    (set) => ({
      schools: [] as School[],
      selectedSchool: null as School | null,
      isLoading: false,

      fetchSchools: async (name?: string, page = 1) => {
        set({ isLoading: true });
        try {
          const url = name
            ? `${BASE_URL}/schools?name=${name}&page=${page}&limit=10`
            : `${BASE_URL}/schools?page=${page}&limit=10`;
          const response = await fetch(url);
          const schools = await response.json();
          set((state) => ({
            schools: page === 1 ? schools : [...state.schools, ...schools],
            isLoading: false,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchSchoolById: async (id) => {
        try {
          const response = await fetch(`${BASE_URL}/schools/${id}`);
          const school = await response.json();

          set({ selectedSchool: school });

          return school;
        } catch (error) {
          console.error(error);
          return null;
        }
      },

      setSelectedSchool: (school) => {
        set({ selectedSchool: school });
      },

      clearSelectedSchool: () => {
        set({ selectedSchool: null });
      },

      createSchool: async (newSchool) => {
        try {
          const response = await fetch(`${BASE_URL}/schools`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSchool),
          });

          const createdSchool = await response.json();
          set((state) => ({
            schools: [...state.schools, createdSchool],
          }));
        } catch (error) {
          console.error(error);
        }
      },

      updateSchool: async (id, updateSchool) => {
        try {
          const response = await fetch(`${BASE_URL}/schools/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateSchool),
          });

          const updatedSchool = await response.json();

          set((state) => ({
            schools: state.schools.map((school) =>
              school.id === id ? updatedSchool : school,
            ),
          }));
        } catch (error) {
          console.error(error);
        }
      },

      deleteSchool: async (id) => {
        try {
          await fetch(`${BASE_URL}/schools/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            schools: state.schools.filter((school) => school.id !== id),
          }));
        } catch (error) {
          console.error(error);
        }
      },
    }),
    {
      name: 'school-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
