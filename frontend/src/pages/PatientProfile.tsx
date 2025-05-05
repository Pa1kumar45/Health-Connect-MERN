import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Phone, Droplet, AlertCircle, Plus, Trash2, Image } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Patient, EmergencyContact } from '../types';
import { apiService } from '../services/api.service';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth.service';

interface PatientFormData {
  name: string;
  email: string;
  avatar: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  role: string;
  bloodGroup: string;
  allergies: string;
  contactNumber: string;
  emergencyContact: EmergencyContact[];
}

const PatientProfile = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();
  // console.log("currentUser from the context",currentUser)

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<PatientFormData | null>({
    name: '',
    email: '',
    avatar: '',
    dateOfBirth: '',
    role: 'patient',
    gender: '',
    bloodGroup: '',
    allergies: '',
    contactNumber: '',
    emergencyContact: []
  });

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if(currentUser?.role === 'doctor') {
          return;
        }

        const initialFormData: PatientFormData = {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          avatar: currentUser?.avatar || '',
          dateOfBirth: currentUser?.dateOfBirth || '',
          role: currentUser?.role || 'patient',
          gender: currentUser?.gender || '',
          bloodGroup: currentUser?.bloodGroup || '',
          allergies: currentUser?.allergies || '',
          contactNumber: currentUser?.contactNumber || '',
          emergencyContact: currentUser?.emergencyContact || []
        };
        
        setFormData(initialFormData);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientProfile();
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (index: number, field: keyof EmergencyContact, value: string) => {
    if (!formData) return;

    const updatedContacts = [...formData.emergencyContact];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };

    setFormData(prev => ({
      ...prev!,
      emergencyContact: updatedContacts
    }));
  };

  const addEmergencyContact = () => {
    if (!formData) return;

    setFormData(prev => ({
      ...prev!,
      emergencyContact: [
        ...prev!.emergencyContact,
        { name: '', relationship: '', phone: '' }
      ]
    }));
  };

  const removeEmergencyContact = (index: number) => {
    if (!formData) return;

    setFormData(prev => ({
      ...prev!,
      emergencyContact: prev!.emergencyContact.filter((_, i) => i !== index)
    }));
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
        emergencyContact: formData.emergencyContact
      };

      const UpdatedData = await apiService.updatePatientProfile(submitData as Patient);
      const updatedData=UpdatedData.data;
      
      // Update both currentUser and formData with the complete data
      setCurrentUser(UpdatedData.data);
      
      // Create a new form data object with all required fields
      const newFormData: PatientFormData = {
        name: updatedData.name || '',
        email: updatedData.email || '',
        avatar: updatedData.avatar || '',
        dateOfBirth: updatedData.dateOfBirth || '',
        role: updatedData.role || 'patient',
        gender: updatedData.gender || '',
        bloodGroup: updatedData.bloodGroup || '',
        allergies: updatedData.allergies || '',
        contactNumber: updatedData.contactNumber || '',
        emergencyContact: formData.emergencyContact // Preserve the current emergency contacts
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

  if (!currentUser && !formData) {
    console.log("currentUser",currentUser)
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
                  {formData?.name?.charAt(0).toUpperCase() || 'P'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formData?.name}
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">
                  Patient Profile
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Mail size={18} className="text-blue-500" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm bg-gray-50 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-500" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData?.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User size={18} className="text-blue-500" /> Gender
                  </label>
                  <select
                    name="gender"
                    value={formData?.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Droplet size={18} className="text-blue-500" /> Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData?.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Phone size={18} className="text-blue-500" /> Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData?.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} className="text-blue-500" /> Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData?.allergies}
                    onChange={handleChange}
                    placeholder="Enter allergies (if any)"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Image size={18} className="text-blue-500" /> Profile Picture URL
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData?.avatar}
                    onChange={handleChange}
                    placeholder="Enter image URL"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone size={20} className="text-blue-500" /> Emergency Contacts
                </h3>
                <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} /> Add Contact
                </button>
              </div>

              {formData?.emergencyContact.map((contact, index) => (
                <div key={index} className="p-6 border rounded-xl dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => handleEmergencyContactChange(index, 'relationship', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="mt-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 size={16} /> Remove Contact
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

export default PatientProfile;