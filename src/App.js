// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navbar from './components/Navbar'; // We will create this next

import HRDashboard from './components/HRDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import PrivateRoute from './utils/PrivateRoute';
import ManageJobs from './components/ManageJobs';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="container mx-auto p-4">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/dashboard/hr" element={<PrivateRoute role="hr"><HRDashboard /></PrivateRoute>} />
            <Route path="/dashboard/candidate" element={<PrivateRoute role="candidate"><CandidateDashboard /></PrivateRoute>} />
            <Route path="/manage-jobs" element={<PrivateRoute role="hr"><ManageJobs /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;