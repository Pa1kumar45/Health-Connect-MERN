import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Doctor, Patient } from '../types';
// import { apiService } from '../services/api.service';

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

  // const [currentUser, setCurrentUser] = useState<Doctor | Patient | null>(() => {
  //   const savedUser = localStorage.getItem('user');
  //   return savedUser ? JSON.parse(savedUser) : null;
  // });
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

  // Load user data if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const loadUser = async () => {
        try {
          setIsLoading(true);
          setError(null);
          // const userData = await apiService.getCurrentUser();
          // setCurrentUser(userData);
          // Always update localStorage with the latest complete data
          // localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user data');
          console.error('Failed to load user data:', err);
          // Clear invalid token and user data
          localStorage.removeItem('token');
          // localStorage.removeItem('user');
          setCurrentUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadUser();
    }
  }, []); // Remove currentUser dependency to prevent infinite loop

  // Update localStorage when user changes
  // useEffect(() => {
  //   if (currentUser) {
  //     localStorage.setItem('user', JSON.stringify(currentUser));
  //   } else {
  //     localStorage.removeItem('user');
  //   }
  // }, [currentUser]);

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
        error
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