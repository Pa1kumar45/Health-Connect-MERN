import { Appointment } from '../types/types';
import { axiosInstance } from '../utils/axios';

export const appointmentService = {
  async addAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
    console.log("appointment data", appointmentData);
    const response = await axiosInstance.post('/appointments/', appointmentData);
    console.log("handle submit response", response);
    return response.data;
  },

  async getDoctorAppointments(): Promise<Appointment[]> {
    const response = await axiosInstance.get('/appointments/doctor/');
    return response.data;
  },

  async getPatientAppointments(): Promise<Appointment[]> {
    const response = await axiosInstance.get('/appointments/patient/');
    console.log("patient appointments", response);
    return response.data;
  },

  async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    const response = await axiosInstance.put(`/appointments/${appointmentId}`, appointmentData);
    return response.data;
  },

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<Appointment> {
    const response = await axiosInstance.put(`/appointments/${appointmentId}`, { status });
    return response.data;
  }
};
