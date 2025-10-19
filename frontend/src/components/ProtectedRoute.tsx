import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
        return <Navigate to="/auth" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        // Redirect to a different page or show an unauthorized message
        return <Navigate to="/" replace />; // Or a specific unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
