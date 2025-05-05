import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Doctor, Patient, SignUpFormData } from '../types';
import { apiService } from '../services/api.service';
import { axiosInstance } from '../utils/axios';
import { AuthResponse, LoginCredentials } from '../types';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface AppContextType extends ThemeContextType {
  currentUser: Doctor | Patient | null;
  setCurrentUser: (user: Doctor | Patient | null) => void;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
  signup: (data: SignUpFormData) => void;
  login: (data: LoginCredentials) => void;
  getCurrentUser: () => void;
  connectSocket:(id:string)=> void;
  socket:Socket|null;
  
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [currentUser, setCurrentUser] = useState<Doctor | Patient | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

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

  const signup = async (data: SignUpFormData) => {
    try {
      console.log("register data", data);
      const response = await axiosInstance.post('/auth/register', data);
      console.log("Signup response:", response.data);

     setCurrentUser(response.data.data);
     const id = response.data.data._id;
     connectSocket(id);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };


  const login = async (data: LoginCredentials) => {
    try {
      console.log("logindata", data);
      const response = await axiosInstance.post('/auth/login', data);
      console.log("login responce", response);
      setCurrentUser(response.data.data);
      
     const id = response.data.data._id;
      connectSocket(id);

    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }



  const logout = async () => {
    setCurrentUser(null);
    await axiosInstance.post('/auth/logout');
  }

  const getCurrentUser = async () => {
    const response = await axiosInstance('/auth/me');
    return response
  }

  const connectSocket =(id)=>{
    console.log("new message");
    if(socket?.connected) return ;
    const s = io('http://localhost:5000',{
      query:{
        userId:id
      }
    });
    s.connect();
    setSocket(s);
  }


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
        logout,
        signup,
        login,
        getCurrentUser,
        connectSocket,
        socket
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