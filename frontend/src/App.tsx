import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { VideoCallProvider } from './context/VideoCallContext';
import VideoCall from './components/VideoCall';
import Navbar from './components/Navbar';
import DoctorList from './pages/DoctorList';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PatientAppointments from './pages/PatientAppointments';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import Chat from './pages/Chat';
import DoctorPage from './pages/DoctorPage';

const App: React.FC = () => {
  const { currentUser, setCurrentUser, getCurrentUser } = useApp();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await getCurrentUser();
      if (response?.data?.data) {
        setCurrentUser(response.data.data);
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <VideoCallProvider>
      <Router>
        <VideoCall />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<DoctorList />} />
            <Route path="/signup" element={!currentUser ? <SignUp /> : <Navigate to="/" />} />
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
            {currentUser ? (
              <>
                <Route
                  path="/appointments"
                  element={
                    currentUser?.role === 'patient' ? <PatientAppointments /> : <DoctorDashboard />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    currentUser?.role === 'doctor' ? <DoctorProfile /> : <PatientProfile />
                  }
                />
                <Route path="/chat/:id" element={<Chat />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
            <Route path="/doctor/:id" element={<DoctorPage />} />
          </Routes>
        </div>
      </Router>
    </VideoCallProvider>
  );
};

export default App;