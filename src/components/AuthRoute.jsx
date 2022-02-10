/*
  Uses as a wrapper for routes that needs to be authenticated
*/
import * as auth from '../auth'
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthRoute({ children }) {
  const location = useLocation();

  return auth.isAuthenticated()
    ? children
    : <Navigate to="/login" state={{ path: location.pathname }} replace />;
}