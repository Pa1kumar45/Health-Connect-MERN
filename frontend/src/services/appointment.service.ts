import { Appointment } from '../types';
import { getAuthHeader, API_URL } from './api.service';

export const appointmentService = {
  async addAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    console.log("appointment data",appointmentData);
    const response = await fetch(`${API_URL}/appointments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(appointmentData)
    });

    console.log("handle submit response",response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add appointment');
    }

    return response.json();
  },

  async getDoctorAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_URL}/appointments/doctor/`, {
      headers: {
        ...getAuthHeader()
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch doctor appointments');
    }

    return response.json();
  },

  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
     const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(appointmentData)
    });

    return response.json();
  },


  async updateAppointmentStatus(appointmentId: string, status: string): Promise<Appointment> {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update appointment status');
    }

    return response.json();
  }
};
