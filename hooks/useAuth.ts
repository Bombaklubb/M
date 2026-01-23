import { useState, useEffect } from 'react';
import { User, UserRole, Badge } from '../types';
import {
  getCurrentUser,
  setCurrentUser,
  getUserByUsername,
  saveUser,
} from '../utils/storage';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (username: string, role: UserRole = UserRole.STUDENT): User => {
    let existingUser = getUserByUsername(username);

    if (!existingUser) {
      // Skapa ny användare
      existingUser = createNewUser(username, role);
      saveUser(existingUser);
    }

    setCurrentUser(existingUser);
    setUser(existingUser);
    return existingUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };
};

const createNewUser = (username: string, role: UserRole): User => {
  return {
    id: generateId(),
    username,
    role,
    currentLevel: 3, // Börja på medelnivå
    totalPoints: 0,
    streak: 0,
    lastActivity: new Date().toISOString(),
    badges: [],
    completedTexts: 0,
    avatarId: Math.floor(Math.random() * 10) + 1,
  };
};

const generateId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
