import { Classroom } from '@features/Classroom/types/class';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ClassState {
  classes: Classroom[];
  selectedClasses: Classroom | null;
  setSelectedClasses: (classes: Classroom) => void;
  isLoading: boolean;

  fetchClasses: (id: string | string[], name?: string) => Promise<void>;
  fetchClassesById: (id: string) => Promise<Classroom | null>;
  clearSelectedClasses: () => void;
  createClasses: (classroom: Omit<Classroom, 'id'>) => Promise<void>;
  updateClasses: (
    id: string,
    classroom: Partial<Omit<Classroom, 'id'>>,
  ) => Promise<void>;
  deleteClasses: (id: string) => Promise<void>;
  getClassCountBySchool: (schoolId: string) => number;
}

const BASE_URL = 'http://192.168.1.109:3000';

export const useClassroomStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [] as Classroom[],
      selectedClasses: null as Classroom | null,
      isLoading: false,

      fetchClasses: async (
        schoolId: string | string[],
        name?: string,
        page = 1,
      ) => {
        set({ isLoading: true });
        try {
          const url = name
            ? `${BASE_URL}/classes?schoolId=${schoolId}&name=${name}&page=${page}&limit=10`
            : `${BASE_URL}/classes?schoolId=${schoolId}&page=${page}&limit=10`;
          const response = await fetch(url);
          const classes = await response.json();
          set((state) => ({
            classes: page === 1 ? classes : [...state.classes, ...classes],
            isLoading: false,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchClassesById: async (id) => {
        try {
          const response = await fetch(`${BASE_URL}/classes/${id}`);
          const classes = await response.json();

          set({ selectedClasses: classes });
          return classes;
        } catch (error) {
          console.error(error);
          return null;
        }
      },

      setSelectedClasses: (classes: Classroom) => {
        set({ selectedClasses: classes });
      },

      clearSelectedClasses: () => {
        set({ selectedClasses: null });
      },

      createClasses: async (newClass: Omit<Classroom, 'id'>) => {
        try {
          const response = await fetch(`${BASE_URL}/classes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newClass),
          });

          const createdClasses = await response.json();
          set((state) => ({
            classes: [...state.classes, createdClasses],
          }));
        } catch (error) {
          console.error(error);
        }
      },

      updateClasses: async (id, updateClasses) => {
        try {
          const response = await fetch(`${BASE_URL}/classes/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateClasses),
          });

          const updatedClasses = await response.json();
          set((state) => ({
            classes: state.classes.map((classroom) =>
              classroom.id === id ? updatedClasses : classroom,
            ),
          }));
        } catch (error) {
          console.error('Error on update class', error);
        }
      },

      deleteClasses: async (id) => {
        try {
          await fetch(`${BASE_URL}/classes/${id}`, {
            method: 'DELETE',
          });
          set((state) => ({
            classes: state.classes.filter((classroom) => classroom.id !== id),
          }));
        } catch (error) {
          console.error(error);
        }
      },
      getClassCountBySchool: (schoolId: string) => {
        return get().classes.filter((p) => p.schoolId === schoolId).length;
      },
    }),

    {
      name: 'classes-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
