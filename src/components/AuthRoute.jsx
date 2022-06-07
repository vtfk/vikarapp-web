/*
  Uses as a wrapper for routes that needs to be authenticated
*/
import * as auth from '../auth'
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthRoute({ children }) {
  const location = useLocation();

  let destination = location.pathname || '/'
  if(destination.toLowerCase().includes('login')) destination = '/'

  return auth.isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ path: destination }} replace />;
}