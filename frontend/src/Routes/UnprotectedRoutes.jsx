import { Navigate, Outlet } from 'react-router-dom';
import  { useAuth } from '../Context/AuthContext';

const UnprotectedRoutes = () => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default UnprotectedRoutes;