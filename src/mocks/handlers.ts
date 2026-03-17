import { http, HttpResponse } from 'msw';

interface Classroom {
  id: string;
  schoolId: string;
  name: string;
  shift: string;
  school_year: number;
}

interface School {
  id: string;
  name: string;
  address: string;
}

const INITIAL_SCHOOLS = [
  { id: '1', name: 'Escola Seu Sebastião', address: 'Xique-Xique, bh' },
];

const INITIAL_CLASSES = [
  {
    id: '101',
    schoolId: '1',
    name: 'Matematica',
    shift: 'Manha',
    school_year: 2026,
  },
];

export let schools = [...INITIAL_SCHOOLS];
export let schoolClasses = [...INITIAL_CLASSES];

export const seedDatabase = () => {
  schools = [...INITIAL_SCHOOLS];
  schoolClasses = [...INITIAL_CLASSES];
};

const BASE_URL = 'http://192.168.1.109:3000';

export const handlers = [
  //School
  http.get(`${BASE_URL}/schools`, ({ request }) => {
    const url = new URL(request.url);
    const nameQuery = url.searchParams.get('name')?.toLowerCase() || '';
    const page = Number(url.searchParams.get('page') || 1);
    const limit = 10;

    const filteredSchools = nameQuery
      ? schools.filter((s) => s.name.toLowerCase().includes(nameQuery))
      : schools;

    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedSchools = filteredSchools.slice(start, end);

    const schoolsWithCount = paginatedSchools.map((school) => ({
      ...school,
      classroomCount: schoolClasses.filter(
        (classes) => classes.schoolId === school.id,
      ).length,
    }));
    return HttpResponse.json(schoolsWithCount);
  }),

  http.get(`${BASE_URL}/schools/:id`, ({ params }) => {
    const { id } = params;
    const school = schools.find((s) => s.id === id);
    if (!school) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(school, { status: 200 });
  }),

  http.post(`${BASE_URL}/schools`, async ({ request }) => {
    const newSchool = (await request.json()) as Omit<School, 'id'>;

    if (!newSchool.name || !newSchool.address) {
      return new HttpResponse('Invalid school name or address', {
        status: 400,
      });
    }

    const school = {
      id: Math.random().toString(36).substring(2, 9),
      ...newSchool,
    };
    schools.push(school);
    return HttpResponse.json(school, { status: 201 });
  }),

  http.patch(`${BASE_URL}/schools/:id`, async ({ request, params }) => {
    const { id } = params;
    const updateData = (await request.json()) as Partial<School>;

    const schoolIndex = schools.findIndex((s) => s.id === id);
    if (schoolIndex === -1) {
      return new HttpResponse('School not found', { status: 404 });
    }

    const updatedSchool = {
      ...schools[schoolIndex],
      ...updateData,
    };

    schools[schoolIndex] = updatedSchool;

    return HttpResponse.json(updatedSchool, { status: 200 });
  }),

  http.delete(`${BASE_URL}/schools/:id`, async ({ params }) => {
    const { id } = params;
    if (!id) return HttpResponse.json('School not found', { status: 404 });
    schools = schools.filter((school) => school.id !== id);
    schoolClasses = schoolClasses.filter((classes) => classes.schoolId !== id);
    return HttpResponse.json(id, { status: 200 });
  }),

  //Classroom
  http.get(`${BASE_URL}/classes`, ({ request }) => {
    const url = new URL(request.url);
    const schoolId = url.searchParams.get('schoolId');
    const nameQuery = url.searchParams.get('name')?.toLowerCase() || '';
    const page = Number(url.searchParams.get('page') || '1');
    const limit = 10;

    const filteredClassesName = nameQuery
      ? schoolClasses.filter((c) => c.name.toLowerCase().includes(nameQuery))
      : schoolClasses;

    let filteredClasses = filteredClassesName;
    if (schoolId) {
      filteredClasses = filteredClassesName.filter(
        (c) => c.schoolId === schoolId,
      );
    }

    const start = (page - 1) * limit;
    const end = page * limit;
    const paginatedClasses = filteredClasses.slice(start, end);

    return HttpResponse.json(paginatedClasses, { status: 200 });
  }),

  http.post(`${BASE_URL}/classes`, async ({ request }) => {
    const newClass = (await request.json()) as Omit<Classroom, 'id'>;
    if (!newClass.schoolId) {
      return new HttpResponse('Invalid schoolId', { status: 400 });
    }

    if (!newClass.name || !newClass.shift || !newClass.school_year) {
      return new HttpResponse('Invalid classes name, shift or school_year', {
        status: 400,
      });
    }

    const classes = {
      id: Math.random().toString(36).substring(2, 9),
      ...newClass,
    };

    schoolClasses.push(classes);
    return HttpResponse.json(classes, { status: 201 });
  }),

  http.patch(`${BASE_URL}/classes/:id`, async ({ request, params }) => {
    const { id } = params;
    const updateClassroom = (await request.json()) as Partial<Classroom>;

    if (
      !updateClassroom.name ||
      !updateClassroom.shift ||
      !updateClassroom.school_year
    ) {
      return new HttpResponse('Invalid classes name, shift or school_year', {
        status: 400,
      });
    }

    const classes = schoolClasses.find((c) => c.id === id);
    if (!classes) return new HttpResponse('Class not found', { status: 404 });

    schoolClasses = schoolClasses.map((s) =>
      s.id === id ? { ...s, ...updateClassroom } : s,
    );
    return HttpResponse.json(updateClassroom, { status: 200 });
  }),

  http.delete(`${BASE_URL}/classes/:id`, async ({ params }) => {
    const { id } = params;
    if (!id) return HttpResponse.json('Class not found', { status: 404 });

    schoolClasses = schoolClasses.filter((classes) => classes.id !== id);
    return HttpResponse.json(id, { status: 200 });
  }),
];
