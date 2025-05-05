import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Clock, Plus, Trash2, GraduationCap, Briefcase, Phone } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Doctor, Schedule, Slot } from '../types';
import { apiService } from '../services/api.service';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth.service';
import { doctorService } from '../services/doctor.service';

interface DoctorFormData {
  name: string;
  email: string;
  avatar: string;
  specialization: string;
  experience: number;
  qualification: string;
  about: string;
  contactNumber: string;
  schedule: Schedule[];
}

const DoctorProfile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<DoctorFormData | null>({
    name: '',
    email: '',
    avatar: '',
    specialization: '',
    experience: 0,
    qualification: '',
    about: '',
    contactNumber: '',
    schedule: []
  });

  const initializeSchedule = (existingSchedule: Schedule[]) => {
    const days: Schedule['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => {
      const existingDay = existingSchedule.find(s => s.day === day);
      return existingDay || { day, slots: [] };
    });
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if(currentUser?.role === 'patient') {
          return;
        }

        const initialFormData: DoctorFormData = {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          avatar: currentUser?.avatar || '',
          specialization: currentUser?.specialization || '',
          experience: currentUser?.experience || 0,
          qualification: currentUser?.qualification || '',
          about: currentUser?.about || '',
          contactNumber: currentUser?.contactNumber || '',
          schedule: initializeSchedule(currentUser?.schedule || [])
        };
        
        setFormData(initialFormData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: name === 'experience' ? Number(value) : value
    }));
  };

  const handleSlotChange = (day: Schedule['day'], slotIndex: number, field: keyof Slot, value: string) => {
    if (!formData) return;
    
    const updatedSchedule = formData.schedule.map(scheduleDay => {
      if (scheduleDay.day === day) {
        const updatedSlots = scheduleDay.slots.map((slot, idx) => 
          idx === slotIndex ? { ...slot, [field]: value } : slot
        );
        return { ...scheduleDay, slots: updatedSlots };
      }
      return scheduleDay;
    });

    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleAddSlot = (day: Schedule['day']) => {
    if (!formData) return;
    
    const updatedSchedule = formData.schedule.map(scheduleDay => {
      if (scheduleDay.day === day) {
        return { ...scheduleDay, slots: [...scheduleDay.slots, { start: '', end: '', slotNumber: scheduleDay.slots.length + 1, startTime: '', endTime: '', isAvailable: true }] };
      }
      return scheduleDay;
    });

    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleRemoveSlot = (day: Schedule['day'], slotIndex: number) => {
    if (!formData) return;
    
    const updatedSchedule = formData.schedule.map(scheduleDay => {
      if (scheduleDay.day === day) {
        return { ...scheduleDay, slots: scheduleDay.slots.filter((_, idx) => idx !== slotIndex) };
      }
      return scheduleDay;
    });

    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Create a new object with all the form data
      const submitData = {
        ...currentUser,
        ...formData,
        schedule: formData.schedule
      };

      const response = await doctorService.updateDoctorProfile(submitData as Doctor);
      
      // Update both currentUser and formData with the complete data
      setCurrentUser({...currentUser,...response});
      console.log("response",response)
      
      // Create a new form data object with all required fields
      const newFormData: DoctorFormData = {
        name: response.name || '',
        email: response.email || '',
        avatar: response.avatar || '',
        specialization: response.specialization || '',
        experience: response.experience || 0,
        qualification: response.qualification || '',
        about: response.about || '',
        contactNumber: response.contactNumber || '',
        schedule: formData.schedule // Preserve the current schedule
      };
      
      setFormData(newFormData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!currentUser || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 text-center text-red-600 dark:text-red-400">
          Please login to access your profile
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {error && (
        <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-400 text-red-700" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 px-4 py-3 rounded bg-green-50 border border-green-400 text-green-700" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Doctor Profile
            </h1>
            <div className="flex items-center space-x-4">
              {formData?.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {formData?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100 dark:bg-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Briefcase size={16} /> Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Calendar size={16} /> Experience (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <GraduationCap size={16} /> Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                  <Phone size={16} /> Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                About Yourself
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Profile Picture URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Schedule</h2>
              {formData.schedule.map((scheduleDay) => (
                <div key={scheduleDay.day} className="p-4 border rounded-lg dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{scheduleDay.day}</h3>
                  {scheduleDay.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleSlotChange(scheduleDay.day, slotIndex, 'startTime', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleSlotChange(scheduleDay.day, slotIndex, 'endTime', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(scheduleDay.day, slotIndex)}
                        className="px-2 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSlot(scheduleDay.day)}
                    className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Time Slot
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
