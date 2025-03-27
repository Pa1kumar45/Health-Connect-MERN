// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Mail, Calendar, Droplet, AlertCircle } from 'lucide-react';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { Doctor, Patient } from '../types';
// import { apiService } from '../services/api.service';
// import { useApp } from '../context/AppContext';
// import { authService } from '../services/auth.service';

// interface DoctorFormData {
//   name: string;
//   email: string;
//   avatar: string;
//   specialization: string;
//   experience: number;
//   qualification: string;
//   about: string;
// }

// interface PatientFormData {
//   name: string;
//   email: string;
//   avatar: string;
//   dateOfBirth: string;
//   bloodGroup: string;
//   allergies: string;
// }

// type FormData = DoctorFormData | PatientFormData;

// const UserProfile = () => {
//   const navigate = useNavigate();
//   const { currentUser, setCurrentUser } = useApp();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [formData, setFormData] = useState<FormData | null>(null);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
        
//         // Check for token
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch fresh user profile data
//         const userData = await apiService.getCurrentUser();
        
//         // If no data returned, redirect to login
//         if (!userData) {
//           authService.logout();
//           setCurrentUser(null);
//           navigate('/login');
//           return;
//         }
        
//         // Initialize form data based on user role
//         const initialFormData = userData.role === 'doctor' 
//           ? {
//               name: userData.name || '',
//               email: userData.email || '',
//               avatar: userData.avatar || '',
//               specialization: (userData as Doctor).specialization || '',
//               experience: (userData as Doctor).experience || 0,
//               qualification: (userData as Doctor).qualification || '',
//               about: (userData as Doctor).about || '',
//             } as DoctorFormData
//           : {
//               name: userData.name || '',
//               email: userData.email || '',
//               avatar: userData.avatar || '',
//               dateOfBirth: (userData as Patient).dateOfBirth || '',
//               bloodGroup: (userData as Patient).bloodGroup || '',
//               allergies: ((userData as Patient).allergies || []).join(', '),
//             } as PatientFormData;
        
//         setFormData(initialFormData);
//         setCurrentUser(userData);
//       } catch (err) {
//         console.error('Failed to load profile:', err);
//         setError(err instanceof Error ? err.message : 'Failed to load profile');
        
//         // If unauthorized, clear data and redirect to login
//         if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
//           authService.logout();
//           setCurrentUser(null);
//           navigate('/login');
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [navigate, setCurrentUser]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     if (!formData) return;
    
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev!,
//       [name]: name === 'experience' ? Number(value) : value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData || !currentUser) return;
    
//     try {
//       setIsLoading(true);
//       setError(null);
//       setSuccess(null);

//       // Check for token before update
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('Authentication required');
//       }

//       let updatedData;
//       if (currentUser.role === 'doctor') {
//         const doctorData = formData as DoctorFormData;
//         updatedData = await apiService.updateProfile({
//           ...doctorData,
//           role: 'doctor'
//         });
//       } else {
//         const patientData = formData as PatientFormData;
//         updatedData = await apiService.updateProfile({
//           ...patientData,
//           role: 'patient',
//           allergies: patientData.allergies
//             .split(',')
//             .map(a => a.trim())
//             .filter(Boolean)
//         });
//       }
      
//       // Update both context and localStorage with new data
//       setCurrentUser(updatedData);
//       localStorage.setItem('user', JSON.stringify(updatedData));
//       setSuccess('Profile updated successfully!');
//     } catch (err) {
//       console.error('Failed to update profile:', err);
//       setError(err instanceof Error ? err.message : 'Failed to update profile');
      
//       // If unauthorized, clear data and redirect to login
//       if (err instanceof Error && err.message.toLowerCase().includes('unauthorized')) {
//         authService.logout();
//         setCurrentUser(null);
//         navigate('/login');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <LoadingSpinner />
//       </div>
//     );
//   }

//   if (!currentUser || !formData) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="p-4 text-center text-red-600 dark:text-red-400">
//           Please login to access your profile
//         </div>
//       </div>
//     );
//   }

//   const isDoctorForm = currentUser.role === 'doctor';
//   const doctorData = formData as DoctorFormData;
//   const patientData = formData as PatientFormData;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {error && (
//         <div className="mb-4 px-4 py-3 rounded bg-red-50 border border-red-400 text-red-700" role="alert">
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
      
//       {success && (
//         <div className="mb-4 px-4 py-3 rounded bg-green-50 border border-green-400 text-green-700" role="alert">
//           <span className="block sm:inline">{success}</span>
//         </div>
//       )}
      
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//             {isDoctorForm ? 'Doctor Profile' : 'Patient Profile'}
//           </h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//               />
//             </div>

//             {isDoctorForm ? (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Specialization
//                   </label>
//                   <input
//                     type="text"
//                     name="specialization"
//                     value={doctorData.specialization}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Experience (years)
//                   </label>
//                   <input
//                     type="number"
//                     name="experience"
//                     value={doctorData.experience}
//                     onChange={handleChange}
//                     min="0"
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Qualification
//                   </label>
//                   <input
//                     type="text"
//                     name="qualification"
//                     value={doctorData.qualification}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     About
//                   </label>
//                   <textarea
//                     name="about"
//                     value={doctorData.about}
//                     onChange={handleChange}
//                     rows={4}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={patientData.dateOfBirth}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Blood Group
//                   </label>
//                   <input
//                     type="text"
//                     name="bloodGroup"
//                     value={patientData.bloodGroup}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                     Allergies (comma-separated)
//                   </label>
//                   <input
//                     type="text"
//                     name="allergies"
//                     value={patientData.allergies}
//                     onChange={handleChange}
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                   />
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? <LoadingSpinner /> : 'Save Changes'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;