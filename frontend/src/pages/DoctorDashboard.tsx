import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MessageSquare, Check, X, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Appointment } from '../types';
import { appointmentService } from '../services/appointment.service';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api.service';
// import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const {currentUser, setCurrentUser} = useApp();
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
      
    //   console.log("all appointments",appointments);
      const appointments = await appointmentService.getDoctorAppointments();
      console.log("all",appointments);
      setPendingAppointments(appointments.filter(app => app.status === 'pending'));
      // setUpcomingAppointments(appointments.filter(app => app.status === 'scheduled' && new Date(app.date) >= new Date() && new Date(app.startTime) > new Date()));
      setActiveAppointments(appointments.filter(app => new Date(`${app.date}T${app.startTime}`) < new Date() && new Date(`${app.date}T${app.endTime}`) > new Date()));
      setUpcomingAppointments(appointments.filter(app => app.status === 'scheduled' ));
    } catch (err) {
      setError('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppointment = async (appointment: Appointment, status: string) => {
    try {
      
    console.log("appointment",appointment);
    appointment.status = status;
    console.log("finalappointment",appointment);

      const updatedAppointment = await appointmentService.updateAppointment(appointment._id!,appointment);
      console.log("updated appointment",updatedAppointment);
      fetchAppointments();
    }
    catch (err) {
      setError('Failed to update appointment');
    }


  };


  const handlechangeComment =  (ID:string ,e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("comment",e.target.value);
    setPendingAppointments(pendingAppointments=>pendingAppointments.map(
      (appointment)=>appointment._id===ID
      ?{...appointment,comment:e.target.value}
      :appointment));
  };
 

  if (isLoading) return <LoadingSpinner />;

  if (!currentUser) {
    // navigate('/login');
    // return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-400 text-red-700 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Pending Appointments</h2>
          {pendingAppointments.map(appointment => (
            <div id={appointment._id} key={appointment._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <p>Patient: {appointment.patientId?.name}</p>
              <p>Date: {new Date(appointment.date).toLocaleString()}</p>
              <p>Time: {appointment.startTime} - {appointment.endTime}</p>
              <p>Mode: {appointment.mode}</p>
              <p>Reason: {appointment.reason}</p>
              {/* option to write a comment form the doctor uisng an input box */}
                <textarea
                className="w-full p-2 mt-2 border rounded"
                placeholder="Write a comment..."
                value={appointment.comment||""}
                onChange={(e) => {handlechangeComment(appointment._id, e)}}
                rows={3}
                ></textarea>

              <div className="mt-2">
                <button
                  onClick={
                    () => handleUpdateAppointment(appointment,'scheduled')
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleUpdateAppointment(appointment,'cancelled')}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {(upcomingAppointments.length === 0) ?(
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex items-center">
              <Clock size={24} className="mr-2" />
              <p>No upcoming appointments</p>
            </div>
          ):(
          upcomingAppointments.map(appointment => (
            <div key={appointment._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
              <p>Patient: {appointment.patientId?.name}</p>
              <p>Date: {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString()}</p>
              <p>Mode: {appointment.mode}</p>
            </div>
          )))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Active Appointments</h2>
        { activeAppointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex items-center">
            <Clock size={24} className="mr-2" />
            <p>No active appointments</p>
          </div>
        ):(
        activeAppointments.map(appointment => (
          <div key={appointment._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 flex justify-between items-center">
            <div>
              <p>Patient: {appointment?.patientId?.name}</p>
              <p>Date: {new Date(`${appointment.date}T${appointment.startTime}`).toLocaleString()}</p>
              <p>Mode: {appointment.mode}</p>
            </div>
            <div>
              
                <button className="bg-blue-500 text-white p-2 rounded mr-2">
                  <Video size={20} />
                </button>
             
              <button className="bg-green-500 text-white p-2 rounded" onClick={()=>{navigate(`/chat/${appointment.patientId?._id}`)}}>
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default DoctorDashboard;
