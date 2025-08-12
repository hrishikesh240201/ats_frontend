// src/components/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
            toast.success('Registration successful! Please log in.');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Registration failed!', error);
            toast.error('Registration failed. Please try again.');
        }
    };

      return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;