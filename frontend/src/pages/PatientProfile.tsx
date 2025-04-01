import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';;
import LoadingSpinner from '../components/LoadingSpinner';
import { Patient, EmergencyContact } from '../types';
import { apiService } from '../services/api.service';
import { useApp } from '../context/AppContext';
import { authService } from '../services/auth.service';
import { isAuthenticated } from '../utils/auth';

interface PatientFormData {
  name: string;
  email: string;
  avatar: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | '';
  role:string,
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
    name:  '',
    email:'',
    avatar: '',
    dateOfBirth: '',
    role:'patient',
    gender: '',
    bloodGroup:  '',
    allergies: '',
    contactNumber:'',
    emergencyContact: []
  }
    
    
  );

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
      
        setIsLoading(true);
        setError(null);
        
        if(currentUser?.role=='doctor'){
          return 
        }
        const initialFormData: PatientFormData = {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
          avatar: currentUser?.avatar || '',
          dateOfBirth: currentUser?.dateOfBirth || '',
          role:currentUser?.role||'patient',
          gender: currentUser?.gender || '',
          bloodGroup: currentUser?.bloodGroup || '',
          allergies: currentUser?.allergies || '',
          contactNumber: currentUser?.contactNumber || '',
          emergencyContact: currentUser?.emergencyContact || []
        };
        console.log("initialformdata",initialFormData)
        setFormData({...formData,...initialFormData});
        console.log("current user after useeffect",currentUser)
        console.log("formdata after useeffect",formData)
      } catch (err) {
        console.log('Failed to load profile:', err);
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientProfile();
  }, [navigate, setCurrentUser]);

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
  
    // console.log("updated emergency contact",formData.emergencyContact)
    // console.log("updated emergency contact",)
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

      console.log("data which is sent to the backend",currentUser)

      const updatedData = await apiService.updatePatientProfile({ ...currentUser,...formData
       }as Patient);
      console.log("updatedData",updatedData)
      
      setCurrentUser(updatedData.data);
    //   localStorage.setItem('user', JSON.stringify(updatedData));
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.log('Failed to update profile:', err);
      
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Patient Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData?.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData?.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Blood Group
                </label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData?.bloodGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData?.contactNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={formData?.allergies}
                onChange={handleChange}
                placeholder="Enter allergies (if any)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Emergency Contacts
                </h3>
                <button
                  type="button"
                  onClick={addEmergencyContact}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Contact
                </button>
              </div>

              {formData?.emergencyContact.map((contact, index) => (
                <div key={index} className="p-4 border rounded-md space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => handleEmergencyContactChange(index, 'relationship', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEmergencyContact(index)}
                    className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
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

export default PatientProfile;