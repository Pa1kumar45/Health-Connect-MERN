import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Check, X, Clock, Calendar, User, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Appointment, AppointmentStatus } from '../types';
import { appointmentService } from '../services/appointment.service';
import { useApp } from '../context/AppContext';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [activeAppointments, setActiveAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const appointments = await appointmentService.getDoctorAppointments();
      
      setPendingAppointments(appointments.filter(app => app.status === 'pending'));
      setActiveAppointments(appointments.filter(app => 
        new Date(`${app.date}T${app.startTime}`) < new Date() && 
        new Date(`${app.date}T${app.endTime}`) > new Date()
      ));
      setUpcomingAppointments(appointments.filter(app => app.status === 'scheduled'));
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointment: Appointment, status: AppointmentStatus) => {
    try {
      const updatedAppointment = await appointmentService.updateAppointment(
        appointment._id!,
        { ...appointment, status }
      );
      fetchAppointments();
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  const handleChangeComment = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPendingAppointments(prev => prev.map(appointment =>
      appointment._id === id
        ? { ...appointment, comment: e.target.value }
        : appointment
    ));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, Dr. {currentUser?.name}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-400 text-red-700 shadow-sm" role="alert">
          <AlertCircle className="inline-block mr-2" size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


         {/* Active Appointments */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Video size={20} className="text-blue-500" />
            Active Appointments
          </h2>
        </div>
        <div className="p-6">
          {activeAppointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Video size={32} className="mx-auto mb-2" />
              <p>No active appointments</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAppointments.map(appointment => (
                <div key={appointment._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {typeof appointment.patientId === 'object' ? appointment.patientId.name : 'Unknown Patient'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    <span className="font-medium">Mode:</span> {appointment.mode}
                  </p>
                  <div className="flex gap-2">
                    {appointment.mode === 'video' && (
                      <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <Video size={16} />
                        Start Video Call
                      </button>
                    )}
                    <button 
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      onClick={() => navigate(`/chat/${typeof appointment.patientId === 'object' ? appointment.patientId._id : ''}`)}
                    >
                      <MessageSquare size={16} />
                      Start Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        {/* Pending Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              Pending Appointments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {pendingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock size={32} className="mx-auto mb-2" />
                <p>No pending appointments</p>
              </div>
            ) : (
              pendingAppointments.map(appointment => (
                <div key={appointment._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {typeof appointment.patientId === 'object' ? appointment.patientId.name : 'Unknown Patient'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    <span className="font-medium">Reason:</span> {appointment.reason}
                  </p>
                  <textarea
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-3"
                    placeholder="Write a comment..."
                    value={appointment.comment || ""}
                    onChange={(e) => handleChangeComment(appointment._id!, e)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateAppointment(appointment, 'scheduled')}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateAppointment(appointment, 'cancelled')}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" />
              Upcoming Appointments
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar size={32} className="mx-auto mb-2" />
                <p>No upcoming appointments</p>
              </div>
            ) : (
              upcomingAppointments.map(appointment => (
                <div key={appointment._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {typeof appointment.patientId === 'object' ? appointment.patientId.name : 'Unknown Patient'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.startTime}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    <span className="font-medium">Mode:</span> {appointment.mode}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default DoctorDashboard;
