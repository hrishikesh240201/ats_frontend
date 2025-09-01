// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ScreeningPage from './components/ScreeningPage';
import PrivateRoute from './utils/PrivateRoute';
import ManageJobs from './components/ManageJobs';
import ManageAutomation from './components/ManageAutomation';
import CandidateDashboard from './components/CandidateDashboard';
import HRMissionControl from './components/HRMissionControl';
import AllApplications from './components/AllApplications';
import CandidateDetailView from './components/CandidateDetailView';
import ResumeScanner from './components/ResumeScanner';
import ResumeBuilder from './components/ResumeBuilder'; // This was the missing import

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
            <Route path="/screening/:sessionId" element={<ScreeningPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard/candidate" element={<PrivateRoute role="candidate"><CandidateDashboard /></PrivateRoute>} />
            <Route path="/resume-scanner" element={<PrivateRoute role="candidate"><ResumeScanner /></PrivateRoute>} />
            <Route path="/resume-builder" element={<PrivateRoute role="candidate"><ResumeBuilder /></PrivateRoute>} />
            
            <Route path="/dashboard/hr" element={<PrivateRoute role="hr"><HRMissionControl /></PrivateRoute>} />
            <Route path="/all-applications" element={<PrivateRoute role="hr"><AllApplications /></PrivateRoute>} />
            <Route path="/application/:id" element={<PrivateRoute role="hr"><CandidateDetailView /></PrivateRoute>} />
            <Route path="/manage-jobs" element={<PrivateRoute role="hr"><ManageJobs /></PrivateRoute>} />
            <Route path="/manage-automation" element={<PrivateRoute role="hr"><ManageAutomation /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;