import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import {
  getAllUsers,
  getUserByEmail,
  saveUser,
  getSession,
  setSession,
  clearSession,
  StoredUser,
} from '../utils/storage';
import { DEMO_USER } from '../utils/seedData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and check active session
  useEffect(() => {
    // Ensure demo user exists in storage
    const users = getAllUsers();
    if (!users.some((u) => u.email.toLowerCase() === DEMO_USER.email.toLowerCase())) {
      saveUser(DEMO_USER);
    }

    const sessionEmail = getSession();
    if (sessionEmail) {
      const existingUser = getUserByEmail(sessionEmail);
      if (existingUser) {
        setUser({
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          createdAt: existingUser.createdAt,
        });
      } else {
        clearSession();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const storedUser = getUserByEmail(trimmedEmail);

    if (!storedUser) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (storedUser.password && storedUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Set active session
    setSession(storedUser.email);
    setUser({
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      createdAt: storedUser.createdAt,
    });

    return { success: true };
  };

  const loginWithDemo = async (): Promise<void> => {
    // Ensure demo user is present
    let demo = getUserByEmail(DEMO_USER.email);
    if (!demo) {
      saveUser(DEMO_USER);
      demo = DEMO_USER;
    }

    setSession(demo.email);
    setUser({
      id: demo.id,
      name: demo.name,
      email: demo.email,
      createdAt: demo.createdAt,
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    const existing = getUserByEmail(trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: StoredUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: trimmedName,
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);
    setSession(newUser.email);
    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    });

    return { success: true };
  };

  const updateProfile = async (
    name: string,
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in.' };

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      return { success: false, error: 'Name and email cannot be empty.' };
    }

    // Check if new email is already taken by someone else
    if (trimmedEmail !== user.email.toLowerCase()) {
      const existing = getUserByEmail(trimmedEmail);
      if (existing && existing.id !== user.id) {
        return { success: false, error: 'This email is already in use.' };
      }
    }

    const stored = getUserByEmail(user.email);
    const updatedUser: StoredUser = {
      ...stored,
      id: user.id,
      name: trimmedName,
      email: trimmedEmail,
      createdAt: user.createdAt,
    };

    saveUser(updatedUser);
    setSession(trimmedEmail);
    setUser({
      id: user.id,
      name: trimmedName,
      email: trimmedEmail,
      createdAt: user.createdAt,
    });

    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithDemo,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
