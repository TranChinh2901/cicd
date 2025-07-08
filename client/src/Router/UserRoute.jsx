import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Layout/Spinner';
import { useState, useEffect } from 'react';

const UserRoute = ({ children }) => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <Spinner />;
  }
  
  // If user is not logged in, redirect to login page
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, render the protected component
  return children;
};

export default UserRoute;