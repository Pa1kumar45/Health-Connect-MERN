import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
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
import PatientAppointments from './pages/PatientAppointments';
import { getCurrentUser } from './services/api.service';
const App: React.FC = () => {
  const { currentUser ,setCurrentUser} = useApp();
  useEffect(() => {
    const response =getCurrentUser();
    if(response.success){
      setCurrentUser(response.data);
    }
  }, [])
  

  return (

    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<DoctorList />} />

          <Route path="/signup" element={!currentUser ? <SignUp /> :<Navigate to="/" />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          if(currentUser){
            <>
              <Route
                path="/appointments"
                element={
                  currentUser?.role == 'patient' ? <PatientAppointments /> :
                    <DoctorDashboard />
                }
              />
              <Route
          path="/doctorProfile"
          element={
           currentUser?.role=='doctor'?
              <DoctorProfile />:
              <PatientProfile/>
            
          }
        />
            </>

          }
         




          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <DoctorPage />
              </ProtectedRoute>
            }
          />




        </Routes>
      </div>
    </Router>

  );
};

export default App;