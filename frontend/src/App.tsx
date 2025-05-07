import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { VideoCallProvider } from './context/VideoCallContext';
import { MessageProvider } from './context/MessageContext';
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

interface GetCurrentUserResponse {
  data: {
    data: any; // Replace with proper user type if available
    success: boolean;
    message: string;
  }
}

const App: React.FC = () => {
  const { currentUser, setCurrentUser, getCurrentUser } = useApp();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser() as GetCurrentUserResponse;
        if (response?.data?.data) {
          setCurrentUser(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [getCurrentUser, setCurrentUser]);

  return (
    <Router>
      <VideoCallProvider>
        <MessageProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <VideoCall /> {/* Floating overlay, always available */}
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
        </MessageProvider>
      </VideoCallProvider>
    </Router>
  );
};

export default App;