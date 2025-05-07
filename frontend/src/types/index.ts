export interface Patient {
  _id: string;
  name: string;
  email: string;
  role: 'patient';
  avatar?: string;
  profileCompleted: boolean;
  contactNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: Array<{
    name: string;
    relationship: string;
    contactNumber: string;
  }>;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  role: 'doctor';
  avatar?: string;
  specialization?: string;
  experience?: number;
  qualifications?: string[];
  availability?: Schedule[];
  bio?: string;
  contactNumber?: string;
  fees?: number;
  rating?: number;
  reviews?: number;
  profileCompleted: boolean;
}

export interface MedicalHistory {
  date: string;
  diagnosis: string;
  prescription: string;
  doctorId: string;
}

export interface Appointment {
  _id?: string;
  doctorId?: string;
  patientId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'scheduled' | 'cancelled' | 'completed' | 'rescheduled';
  mode: 'video' | 'chat';
  reason?: string; //bypatient while booking
  comment?: string; //for doctor while conforming booking
  notes?: string; //for doctor after the session
  rating?: number;
  review?: string; //by patient
}

// export interface Review {
//   id: string;
//   doctorId: string;
//   patientId: string;
//   rating: number;
//   comment: string;
//   date: string;
// }

export interface Slot {
  slotNumber: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// DaySchedule interface
export interface Schedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  slots: Slot[];
}

export interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  text?: string;
  content?: string;
  createdAt: string;
  image?: string;
  timestamp: string;
  type: 'text' | 'image';
  read: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: Doctor | Patient;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  prescription: string;
  notes?: string;
}