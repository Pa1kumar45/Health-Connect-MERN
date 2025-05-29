import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Clock, Plus, Trash2, GraduationCap, Briefcase, Phone, Image } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Doctor, Schedule, Slot } from '../types/index.ts';

import { useApp } from '../context/AppContext';

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
    <div className="max-w-4xl mx-auto p-6">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-400 text-red-700 shadow-sm" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-400 text-green-700 shadow-sm" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-6">
              {formData?.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-blue-100 dark:border-blue-900">
                  {formData?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formData?.name}
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">
                  {formData?.specialization}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={18} className="text-blue-500" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-500" /> Specialization
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" /> Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-500" /> Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone size={18} className="text-blue-500" /> Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Image size={18} className="text-blue-500" /> Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> About Yourself
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock size={20} className="text-blue-500" /> Weekly Schedule
              </h2>
              {formData.schedule.map((scheduleDay) => (
                <div key={scheduleDay.day} className="p-6 border rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-4">{scheduleDay.day}</h3>
                  {scheduleDay.slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex gap-3 mb-3">
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleSlotChange(scheduleDay.day, slotIndex, 'startTime', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      />
                      <input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleSlotChange(scheduleDay.day, slotIndex, 'endTime', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(scheduleDay.day, slotIndex)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSlot(scheduleDay.day)}
                    className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} /> Add Time Slot
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
