import { Doctor } from '../types';
const API_URL = 'http://localhost:5000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const doctorService = {
  async getAllDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_URL}/doctors`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch doctors');
    }

    return response.json();
  },

  async getDoctorById(id: string): Promise<Doctor> {  
    const response = await fetch(`${API_URL}/doctors/${id}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch doctor');
    }

    return response.json();
  },

  



  async updateDoctorProfile(userData: Partial<Doctor>): Promise<Doctor> {
    
    
    const response = await fetch(`${API_URL}/doctors/profile`, {
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