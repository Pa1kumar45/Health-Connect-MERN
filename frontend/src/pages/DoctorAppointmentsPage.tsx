import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointment.service';
import { Appointment } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const DoctorAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      
      const appointmentsData = await appointmentService.getDoctorAppointments();
      console.log("appotintments",appointmentsData);
      setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      loadAppointments(); // Reload appointments after update
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid gap-4">
        {appointments.map(appointment => (
          <div key={appointment._id} className="border p-4 rounded">
            <p>Patient: {appointment.patientId.name}</p>
            <p>Date: {new Date(appointment.dateTime).toLocaleString()}</p>
            <p>Status: {appointment.status}</p>
            <p>Mode: {appointment.mode}</p>
            <p>Reason: {appointment.reason}</p>
            {appointment.status === 'pending' && (
              <div className="mt-2">
                <button
                  onClick={() => handleStatusUpdate(appointment._id, 'scheduled')}
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
