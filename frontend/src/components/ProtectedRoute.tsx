import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('doctor' | 'patient')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      console.log("hit protected router")
      try {
        if (!isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute; 