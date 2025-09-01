// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser, setAuthTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("--- Step 1: handleSubmit function started. ---");

        try {
            console.log("--- Step 2: Sending login request to backend... ---");
            const tokenResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });
            console.log("--- Step 3: Received token response from backend. ---", tokenResponse.data);
            
            const tokenData = tokenResponse.data;
            const decodedUser = jwtDecode(tokenData.access);

            console.log("--- Step 4: Sending profile request to backend... ---");
            const profileResponse = await axios.get(`http://127.0.0.1:8000/api/users/${decodedUser.user_id}/`, {
                headers: { 'Authorization': `Bearer ${tokenData.access}` }
            });
            console.log("--- Step 5: Received profile response from backend. ---", profileResponse.data);
            
            const fullUser = { ...decodedUser, profile: profileResponse.data.profile };

            console.log("--- Step 6: Updating context and local storage... ---");
            setAuthTokens(tokenData);
            setUser(fullUser);
            localStorage.setItem('authTokens', JSON.stringify(tokenData));
            localStorage.setItem('user', JSON.stringify(fullUser));

            toast.success('Login successful!');
            console.log("--- Step 7: Navigating to homepage... ---");
            navigate('/');
            console.log("--- Step 8: Navigation complete. ---");

        } catch (error) {
            console.error("--- ERROR: Login process failed! ---", error);
            toast.error('Login failed. Please check your credentials and the console for errors.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                />
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;