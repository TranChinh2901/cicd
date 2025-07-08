import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const [auth] = useAuth();
  
  // If user is already logged in and trying to access login/register pages,
  // redirect them to home page
  if (auth?.user && (window.location.pathname === '/login' || window.location.pathname === '/register')) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children components
  return children;
};

export default PublicRoute;