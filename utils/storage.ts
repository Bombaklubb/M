import { User, TextResult, Classroom } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'lasHjalpen_currentUser',
  USERS: 'lasHjalpen_users',
  RESULTS: 'lasHjalpen_results',
  CLASSROOMS: 'lasHjalpen_classrooms',
};

// User management
export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === user.id);

  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }

  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getAllUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
};

export const getUserByUsername = (username: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

// Results management
export const saveResult = (result: TextResult): void => {
  const results = getAllResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
};

export const getAllResults = (): TextResult[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
};

export const getUserResults = (userId: string): TextResult[] => {
  const results = getAllResults();
  return results.filter(r => r.userId === userId);
};

// Classroom management
export const saveClassroom = (classroom: Classroom): void => {
  const classrooms = getAllClassrooms();
  const index = classrooms.findIndex(c => c.id === classroom.id);

  if (index >= 0) {
    classrooms[index] = classroom;
  } else {
    classrooms.push(classroom);
  }

  localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(classrooms));
};

export const getAllClassrooms = (): Classroom[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CLASSROOMS);
  return data ? JSON.parse(data) : [];
};

export const getTeacherClassrooms = (teacherId: string): Classroom[] => {
  const classrooms = getAllClassrooms();
  return classrooms.filter(c => c.teacherId === teacherId);
};
