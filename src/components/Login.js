// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

   // src/components/Login.js

    const handleSubmit = async (e) => {
        e.preventDefault();
        await loginUser(username, password);
    
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