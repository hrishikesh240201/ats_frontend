// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true); // Our new loading state

    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            const tokenResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });
            
            const tokenData = tokenResponse.data;
            const decodedUser = jwtDecode(tokenData.access);

            const profileResponse = await axios.get(`http://127.0.0.1:8000/api/users/${decodedUser.user_id}/`, {
                headers: { 'Authorization': `Bearer ${tokenData.access}` }
            });

            decodedUser.profile = profileResponse.data.profile;
            
            setAuthTokens(tokenData);
            setUser(decodedUser);
            localStorage.setItem('authTokens', JSON.stringify(tokenData));
            toast.success('Login successful!');
            navigate('/'); // Redirect after successful login
            return true;

        } catch (error) {
            console.error("Login failed!", error);
            toast.error('Login failed. Please check your credentials.');
            return false;
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

   // src/context/AuthContext.js

    // This useEffect will run once when the component mounts
    useEffect(() => {
        const fetchUserProfile = async (decodedUser) => {
            try {
                 const profileResponse = await axiosInstance.get(`/users/${decodedUser.user_id}/`);
            decodedUser.profile = profileResponse.data.profile;
            setUser(decodedUser);
            } catch (error) {
                console.error("Could not fetch user profile on page load", error);
                // Maybe the token is old, so log them out
                logoutUser();
            }
        };

        if (authTokens) {
            const decodedUser = jwtDecode(authTokens.access);
            fetchUserProfile(decodedUser);
        }
        setLoading(false); // Set loading to false after the check
    }, [authTokens]); // This dependency array is correct

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};