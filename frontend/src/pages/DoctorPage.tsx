import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { doctorService } from '../services/doctor.service';
import { appointmentService } from '../services/appointment.service';
import { Doctor, Appointment, Slot, Patient } from '../types';
import { apiService } from '../services/api.service';

const DoctorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [currentUser, setCurrentUser] = useState<Doctor |Patient| null>(null);
  const [appointment, setAppointment] = useState<Appointment>(
    {
      date:` ${new Date()}`,
      startTime: '',
      endTime: '',
      status: 'pending',
      mode: 'chat',
      reason: 'Checkup',
    },
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    loadDoctorAndAppointments();
  }, [id]);

  const daysofweek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

   const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null); 
      const userData= await apiService.getCurrentUser();
      setCurrentUser(userData.data.user );
      // Always update localStorage with the latest complete data
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) { 
      // setError(err instanceof Error ? err.message : 'Failed to load user data');
      console.error('Failed to load user data:', err);
      // Clear invalid token and user data
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctorAndAppointments = async () => {
    try {
      setIsLoading(true);
      await loadUser();
      const doctorData = await doctorService.getDoctorById(id!);
      console.log("getDoctorbyid",doctorData);
      setDoctor(doctorData);
      // const appointmentsData = await appointmentService.getDoctorAppointments(id!);
      // setAppointments(appointmentsData);
    } catch (err) {
      setError('Failed to load doctor details and appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppointment = async(appointment:Appointment)=>{

  }
  const handleBookAppointment = async (e: React.FormEvent) => {
    //using this prevents refreshing the page after submit as this is part of the form compoent
    //so we can check what is happenning as the code runs
    // e.preventDefault();

    if (!doctor || !appointment) return;

    try {
      const appointmentData: Partial<Appointment> = {
        doctorId: doctor._id,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        mode: appointment.mode,
        reason: appointment.reason,
      };
      const response = await appointmentService.addAppointment(appointmentData);
      console.log("handle submit response",response);
     
    } catch (err) {
      setError('Failed to book appointment');
    }
  };



  const getSlotColor= (slot:Slot,day:string): string => {
    const dayIndex = daysofweek.indexOf(day);
    const today = new Date().getDay();
    if(dayIndex<today){
     return 'bg-gray-500';
    }
    else if (slot.isAvailable) {
      return 'bg-green-500';
    }
    return 'bg-yellow-500';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {doctor.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">{doctor.specialization}</p>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-gray-600 dark:text-gray-300">
                  0 reviews
                </span>
              </div>
            </div>
            {doctor.avatar && (
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-24 h-24 rounded-full"
              />
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{doctor.about}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Qualifications</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{doctor.qualification}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Experience</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{doctor.experience} years</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Number</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{doctor.contactNumber}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule</h2>
            {doctor.schedule.map((schedule, index) => (
              
              (schedule.slots.length>0) &&
              (<div key={index} className="mt-4">
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{schedule.day}</h3>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {schedule.slots.map((slot, slotIndex) => {
                       const dayIndex = daysofweek.indexOf(schedule.day);
                       const today = new Date().getDay();
                    return (
                      <button
                        key={slotIndex}
                        className={`p-2 rounded ${getSlotColor(slot,schedule.day)} text-white`}
                        onClick={() => {
                          setAppointment({...appointment,date:schedule.day,startTime:slot.startTime,endTime:slot.endTime});
            
                        }}
                        disabled={slot.isAvailable !== true||dayIndex<today}
                      >
                        {`  ${slot.startTime} - ${slot.endTime}`}
                      </button>
                    );
                  })}
                </div>
              </div>)
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Book Appointment
          </h2>
          
          
          {currentUser?.role=='Patient' && <form onSubmit={handleBookAppointment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                value={appointment.date}
                onChange={(e) => setAppointment({...appointment,date:e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Time
              </label>
              <input
                type="time"
                value={appointment.startTime}
                onChange={(e) => setAppointment({...appointment,startTime:e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                End Time
              </label>
              <input
                type="time"
                value={appointment.endTime}
                onChange={(e) => setAppointment({...appointment,endTime:e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Appointment
              </label>
              <textarea
                value={appointment.reason}
                onChange={(e) => setAppointment({...appointment,reason:e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type
              </label>
              <div className="mt-2 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setAppointment({...appointment,mode:'video'})}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    appointment.mode === 'video'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Video Call
                </button>
                <button
                  type="button"
                  onClick={() => setAppointment({...appointment,mode:'chat'})}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    appointment.mode === 'chat'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Chat
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Book Appointment
            </button>
          </form>}

          { currentUser?.role!='Patient' && (
              <div>
                <h1 className='text-white'>Need to a logged in User to book an appointment</h1>
              </div>
                )
          }
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;
