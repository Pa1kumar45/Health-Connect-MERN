import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Video, MessageCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
// import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api.service';
import { appointmentService } from '../services/appointment.service';
import { Doctor, Appointment, Patient } from '../types';
import { doctorService } from '../services/doctor.service';
import { useVideoCall } from '../context/VideoCallContext';

const PatientAppointments = () => {
  const navigate= useNavigate();
  const {currentUser, setCurrentUser} = useApp();
  const { startCall, isInCall } = useVideoCall();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'|'ongoing'>('ongoing');

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [appointmentsData, doctorsData] = await Promise.all([
          appointmentService.getPatientAppointments(),
          doctorService.getAllDoctors()
        ]);
        console.log("appointmentsData",appointmentsData);
        console.log("doctorsData",doctorsData);
        setAppointments(appointmentsData);
        setDoctors(doctorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // console.log("user:",currentUser);

  if (!currentUser || currentUser.role !== 'patient') {
    return <div className='text-white'>Please login as a patient to access this page</div>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

// const filteredAppointments= appointments;

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentStartStamp = new Date(`${appointment.date}T${appointment.startTime}`);
    const appointmentEndStamp = new Date(`${appointment.date}T${appointment.endTime}`);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return appointmentStartStamp > now;
    }else if (filter === 'ongoing') {
      return appointmentStartStamp <= now && appointmentEndStamp > now;
    }else if (filter === 'past') {
      return appointmentEndStamp <= now;
    }
    return true;
  });

  const getDoctor = (doctorId: string) => {
  console.log("doctors hit",doctorId);
    return doctors.find(d => d._id === doctorId);
  };

  const handleStartCall = (doctorId: string) => {
    if (!isInCall) {
        startCall(doctorId);
        // Removed navigate('/videocall')
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Appointments
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 rounded-md ${
              filter === 'ongoing'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-md ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Past
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No appointments found
          </div>
        ) : (
          filteredAppointments.map(appointment => {
            console.log("appointment",appointment);
            const doctor = getDoctor(appointment.doctorId._id);
            console.log("doctor",doctor);
            return (
              <div
                key={appointment._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={doctor?.avatar}
                      alt={doctor?.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Dr. {doctor?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor?.specialization}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'scheduled'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : appointment.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{appointment.startTime} - {appointment.endTime}</span>
                  </div>
                  
                  {appointment.comment && (
                    <div className="col-span-2 flex items-start text-gray-600 dark:text-gray-400">
                      <span className="font-medium mr-2">Comment:</span>
                      <span>{appointment.comment}</span>
                    </div>
                  )}
                  
                  {appointment.reason && (
                    <div className="col-span-2 flex items-start text-gray-600 dark:text-gray-400">
                      <span className="font-medium mr-2">Reason:</span>
                      <span>{appointment.reason}</span>
                    </div>
                  )}
                </div>
                {appointment.status === 'scheduled'&&filter=='ongoing' && (
                  <div className="mt-4 flex space-x-4">

                    {/* fi the appointment is chat only chat buttion */}
                    {appointment.mode === 'chat' ? (
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={()=>navigate(`/chat/${doctor?._id}`)}>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Message
                      </button>
                    ) : (
                      <>
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => handleStartCall(doctor?._id)}>
                      <Video className="h-5 w-5 mr-2" />
                     Video 
                    </button>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" onClick={()=>navigate(`/chat/${doctor?._id}`)}>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Message
                      </button>
                      </>
                    )}
                    
                   
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;