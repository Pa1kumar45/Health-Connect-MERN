import { Doctor } from '../types/index.ts';
const API_URL = import.meta.env.VITE_BACKEND_URL ;



export const doctorService = {
  async getAllDoctors(): Promise<Doctor[]> {
    const response = await fetch(`${API_URL}/api/doctors`,{
      credentials:'include'
    }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch doctors');
    }

    return response.json();
  },

  async getDoctorById(id: string): Promise<Doctor> {  
    const response = await fetch(`${API_URL}/api/doctors/${id}`,{
      credentials:'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch doctor');
    }

    return response.json();
  },

  



  async updateDoctorProfile(userData: Partial<Doctor>): Promise<Doctor> {
    
    
    const response = await fetch(`${API_URL}/api/doctors/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },



}; 