import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Doctor, Patient } from '../types';
import { apiService } from '../services/api.service';
import axios, { AxiosInstance } from 'axios';
import { axiosInstance } from '../utils/axios';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface AppContextType extends ThemeContextType {
  currentUser: Doctor | Patient | null;
  setCurrentUser: (user: Doctor | Patient | null) => void;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [currentUser, setCurrentUser] = useState<Doctor | Patient | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);





  

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev: boolean) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        currentUser,
        setCurrentUser,
        isLoading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useTheme = () => {
  const { isDarkMode, toggleDarkMode } = useApp();
  return { isDarkMode, toggleDarkMode };
};