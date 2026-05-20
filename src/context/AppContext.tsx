import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, TestCase, Status } from '../types';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  testCases: TestCase[];
  addTestCase: (testCase: TestCase) => void;
  updateTestCase: (id: string, updates: Partial<TestCase>) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('qa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [testCases, setTestCases] = useState<TestCase[]>(() => {
    const savedCases = localStorage.getItem('qa_test_cases');
    return savedCases ? JSON.parse(savedCases) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('qa_theme');
    return (savedTheme as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('qa_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qa_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('qa_test_cases', JSON.stringify(testCases));
  }, [testCases]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qa_theme', theme);
  }, [theme]);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  const addTestCase = (newCase: TestCase) => {
    setTestCases((prev) => [newCase, ...prev]);
  };

  const updateTestCase = (id: string, updates: Partial<TestCase>) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, ...updates } : tc))
    );
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <AppContext.Provider
      value={{ user, login, logout, testCases, addTestCase, updateTestCase, theme, toggleTheme }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
