// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, setUser, setAuthTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="bg-gray-900 p-4 rounded mb-6 flex justify-between items-center border border-gray-700">
            <div className="flex items-center space-x-6">
                <Link to="/" className="text-xl font-bold text-white">Job Board</Link>
                {user && user.profile && (
                    <>
                        {user.profile.role === 'hr' && 
                            <>
                                <Link to="/dashboard/hr" className="text-green-400 font-semibold hover:text-green-300">HR Dashboard</Link>
                                <Link to="/manage-automation" className="text-gray-300 hover:text-white">Automation</Link>
                            </>
                        }
                        {user.profile.role === 'candidate' && 
                            <>
                                <Link to="/dashboard/candidate" className="text-green-400 font-semibold hover:text-green-300">My Dashboard</Link>
                                {/* --- THESE ARE THE MISSING LINKS --- */}
                                <Link to="/resume-scanner" className="text-gray-300 hover:text-white">Resume Scanner</Link>
                                <Link to="/resume-builder" className="text-gray-300 hover:text-white">Resume Builder</Link>
                            </>
                        }
                        <span className="text-gray-300">Hello, {user.username}</span>
                    </>
                )}
            </div>
            <div>
                {user ? (
                    <button onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:underline">Logout</button>
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