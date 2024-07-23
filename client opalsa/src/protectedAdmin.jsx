// src/ProtectedAdmin.jsx

import { useAuth } from './context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedAdmin() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <h1>Loading...</h1>;
  if (!loading && (!isAuthenticated || user.role !== 'admin')) return <Navigate to='/' replace />;

  return <Outlet />;
}

export default ProtectedAdmin;
