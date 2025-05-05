export type AppointmentStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
    _id: string;
    doctorId: string | {
        _id: string;
        name: string;
        specialization?: string;
    };
    patientId: string | {
        _id: string;
        name: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    mode: 'video' | 'chat';
    reason?: string;
    comment?: string;
    notes?: string;
    rating?: number;
    review?: string;
} 