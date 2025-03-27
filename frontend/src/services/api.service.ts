import { Doctor, Patient, Appointment, Message, AuthResponse } from '../types';

export const API_URL = 'http://localhost:5000/api';

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export const apiService = {
  // User related APIs
  async getCurrentUser(): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user profile');
    }

    return response.json();
  },


 

  // // Patient related APIs
  // async getPatients(): Promise<Patient[]> {
  //   const response = await fetch(`${API_URL}/patients`, {
  //     headers: {
  //       ...getAuthHeader()
  //     }
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to fetch patients');
  //   }

  //   return response.json();
  // },

  // // Appointment related APIs
  // async getAppointments(): Promise<Appointment[]> {
  //   const response = await fetch(`${API_URL}/appointments`, {
  //     headers: {
  //       ...getAuthHeader()
  //     }
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to fetch appointments');
  //   }

  //   return response.json();
  // },

  // async addAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
  //   const response = await fetch(`${API_URL}/appointments`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...getAuthHeader()
  //     },
  //     body: JSON.stringify(appointmentData)
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to add appointment');
  //   }

  //   return response.json();
  // },

  // async updateAppointmentStatus(
  //   appointmentId: string,
  //   status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'rescheduled'
  // ): Promise<Appointment> {
  //   const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...getAuthHeader()
  //     },
  //     body: JSON.stringify({ status })
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to update appointment');
  //   }

  //   return response.json();
  // },

  // // Message related APIs
  // async addMessage(message: Partial<Message>): Promise<Message> {
  //   const response = await fetch(`${API_URL}/messages`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       ...getAuthHeader()
  //     },
  //     body: JSON.stringify(message)
  //   });

  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.message || 'Failed to send message');
  //   }

  //   return response.json();
  // },

  // // Profile related APIs
//   async updateProfile(userData: Partial<Doctor | Patient>): Promise<Patient> {
//     const user = localStorage.getItem('user');
//     const endpoint = user ? JSON.parse(user).role === 'doctor' ? 'doctors' : 'patients' : '';
    
//     const response = await fetch(`${API_URL}/${endpoint}/profile`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         ...getAuthHeader()
//       },
//       body: JSON.stringify(userData)
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to update profile');
//     }

//     return response.json();
//   }
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