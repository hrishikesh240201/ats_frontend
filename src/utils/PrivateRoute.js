// src/utils/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    // This check is very basic. You might need to wait for user profile data to load.
    if (user.profile && user.profile.role !== role) {
        return <div>Access Denied</div>; // Or redirect to a different page
    }

    return children;
};

export default PrivateRoute;