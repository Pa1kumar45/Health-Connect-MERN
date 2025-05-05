import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { doctorService } from '../services/doctor.service';
import { Doctor } from '../types';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DoctorList = () => {
  const { isDarkMode } = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState(0);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      console.log("all doctors details",data);
      setDoctors(data);
    } catch (err) {
      setError('Failed to load doctors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization;
    // const matchesRating = doctor.rating >= minRating;
    const matchesExperience = doctor.experience >= minExperience;

    // return matchesSearch && matchesSpecialization && matchesRating && matchesExperience;
    return matchesSearch && matchesSpecialization && matchesExperience;
  });

  const getAvatarUrl = (doctor: Doctor) => {
    if (doctor.avatar) return doctor.avatar;
    
    // Generate a color based on the first letter of the name
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    const colorIndex = doctor.name.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    
    return (
      <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-2xl font-bold`}>
        {doctor.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={loadDoctors}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-2xl font-bold mb-4 md:mb-0 dark:text-white">Find Your Doctor</h1>
          
          <div className="relative flex-1 md:max-w-md md:ml-4">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Specialization</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
{/* 
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Minimum Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">Minimum Experience</label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className={`w-full p-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100'
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value={0}>Any Experience</option>
              <option value={5}>5+ Years</option>
              <option value={10}>10+ Years</option>
              <option value={15}>15+ Years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <Link
              key={doctor._id}
              to={`/doctor/${doctor._id}`}
              className={`${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
              } rounded-lg p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center space-x-4">
                {typeof getAvatarUrl(doctor) === 'string' ? (
                  <img
                    src={getAvatarUrl(doctor) as string}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  getAvatarUrl(doctor)
                )}
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">{doctor.name}</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {doctor.specialization}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {/* <div className="flex items-center"> */}
                  {/* <Star className="w-5 h-5 text-yellow-400 fill-current" /> */}
                  {/* <span className="ml-1 dark:text-gray-300">{doctor.rating ? doctor.rating.toFixed(1) : 'No ratings'}</span> */}
                  {/* <span className="ml-1 dark:text-gray-300">{'No ratings'}</span> */}
                {/* </div> */}
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {doctor.experience} years experience
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No doctors found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;