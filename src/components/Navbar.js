// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);

     return (
        <nav className="bg-gray-900 p-4 rounded mb-6 flex justify-between items-center border border-gray-700">
            {/* Group for left-aligned items */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="text-xl font-bold text-white">Job Board</Link>
                
                {/* Conditionally render dashboard links and user info */}
                {user && (
                    <>
                        {user.profile?.role === 'hr' && 
                            <Link to="/dashboard/hr" className="text-green-400 font-semibold hover:text-green-300">HR Dashboard</Link>
                        }
                        {user.profile?.role === 'candidate' && 
                            <Link to="/dashboard/candidate" className="text-green-400 font-semibold hover:text-green-300">My Dashboard</Link>
                        }
                        <span className="text-gray-300">Hello, {user.username}</span>
                    </>
                )}
            </div>

            {/* Group for right-aligned items */}
            <div>
                {user ? (
                    <button onClick={logoutUser} className="text-red-400 hover:text-red-300 hover:underline">Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="mr-4 text-blue-400 hover:underline">Login</Link>
                        <Link to="/signup" className="text-blue-400 hover:underline">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;