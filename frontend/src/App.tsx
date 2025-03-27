import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/SignUp';
// import UserProfile from './pages/UserProfile';
import PatientProfile from './pages/PatientProfile';
import DoctorProfile from './pages/DoctorProfile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import DoctorList from './pages/DoctorList';
import DoctorPage from './pages/DoctorPage';
import DoctorDashboard from './pages/DoctorDashboard';
const App: React.FC = () => {
  return (
    <AppProvider>
    <Router>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<DoctorList />} />
        
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
         {/*
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/history"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        */}
        <Route
          path="/doctor/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/"
          element={
            
              <DoctorDashboard />
            
          }
        />
        
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctorProfile"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        {/*
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-call/:roomId"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </div>
  </Router>
  </AppProvider>
  );
};

export default App;