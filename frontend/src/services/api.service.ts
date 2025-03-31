import { AppProvider, useApp } from '../context/AppContext';
import { Doctor, Patient, Appointment, Message, AuthResponse } from '../types';

import { axiosInstance } from '../utils/axios';

export const API_URL = 'http://localhost:5000/api';

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const apiService = {
  // User related APIs
  // async getCurrentUser(): Promise<AuthResponse> {
  //   const response = await fetch(`${API_URL}/auth/me`, {
  //     method:"GET",
  //     credentials: "include", 
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to fetch user profile');
  //   }

  //   return response.json();
  // },
  async updatePatientProfile(userData: Partial<Patient>): Promise<Patient> {
    
    
    const response = await fetch(`${API_URL}/patients/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

}; 



export const getCurrentUser=async()=> {

  const response = await axiosInstance('/auth/me');
    return response
  }