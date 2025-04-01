import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
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
import Chat from './pages/Chat';
const App: React.FC = () => {
  const { currentUser, setCurrentUser, getCurrentUser } = useApp();
  useEffect(() => {

    const fetchCurrentUser = async () => {

      const response = await getCurrentUser();

      setCurrentUser(response.data.data);
      console.log("navbar", currentUser);
    }
    fetchCurrentUser();
  }, [])




  return (

    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<DoctorList />} />

          <Route path="/signup" element={!currentUser ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          {currentUser ?
            (<>
              <Route
                path="/appointments"
                element={
                  currentUser?.role == 'patient' ? <PatientAppointments /> :
                    <DoctorDashboard />
                }
              />
              <Route
                path="/profile"
                element={
                  currentUser?.role == 'doctor' ?
                    <DoctorProfile /> :
                    <PatientProfile />

                }
              />
              <Route path='/chat/:id'
              element={
                <Chat/>
              }/>
            </>) :
            <Route path="*" element={<Navigate to="/" />}></Route>

          }





          <Route
            path="/doctor/:id"
            element={
              <DoctorPage />
            }
          />




        </Routes>
      </div>
    </Router>

  );
};

export default App;