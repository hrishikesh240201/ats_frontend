// src/components/HRDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import AtsScoreChart from './AtsScoreChart';
import NotesSection from './NotesSection';
import ResumeViewer from './ResumeViewer';
import InterviewQuestionsModal from './InterviewQuestionsModal';
import ResumeSummaryModal from './ResumeSummaryModal'; // 1. Import the new component
import { FileText, MessageSquare, BrainCircuit, FileSearch } from 'lucide-react';
import Spinner from './Spinner';

const HRDashboard = () => {
    const [applications, setApplications] = useState(null);
    const [expandedAppId, setExpandedAppId] = useState(null);
    const [viewingAppId, setViewingAppId] = useState(null);
    const [questionAppId, setQuestionAppId] = useState(null);
    const [summaryAppId, setSummaryAppId] = useState(null); // 2. Add state for the summary modal

    // ... all other functions (fetchJobs, useEffects, handleFilterChange, etc.) remain the same ...
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        job: ''
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axiosInstance.get('/jobs/');
                setJobs(response.data);
            } catch (error) {
                console.error("Failed to fetch jobs for filter", error);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append('search', filters.search);
                if (filters.status) params.append('status', filters.status);
                if (filters.job) params.append('job', filters.job);

                const response = await axiosInstance.get('/dashboard/hr/', { params });
                setApplications(response.data);
            } catch (error) {
                console.error('Failed to fetch HR dashboard data', error);
            }
        };
        fetchApplications();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await axiosInstance.patch(`/applications/${appId}/status/`, { status: newStatus });
            const params = new URLSearchParams(filters);
            const response = await axiosInstance.get('/dashboard/hr/', { params });
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error: Could not update application status.");
        }
    };

    const toggleNotes = (appId) => {
        setExpandedAppId(prevId => (prevId === appId ? null : appId));
    };


    if (!applications) {
        return <Spinner />;
    }


    return (
        <div>
            {/* Header and Filter sections remain the same */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">All Candidate Applications</h2>
                <Link to="/manage-jobs" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Manage Job Postings
                </Link>
            </div>
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="p-2 border rounded bg-gray-700 text-white border-gray-600"
                />
                <select
                    name="job"
                    value={filters.job}
                    onChange={handleFilterChange}
                    className="p-2 border rounded bg-gray-700 text-white border-gray-600"
                >
                    <option value="">Filter by Job</option>
                    {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                </select>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="p-2 border rounded bg-gray-700 text-white border-gray-600"
                >
                    <option value="">Filter by Status</option>
                    <option value="received">Received</option>
                    <option value="under_review">Under Review</option>
                    <option value="interview">Interview</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Applications List */}
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
                <div className="space-y-4">
                    {applications.length > 0 ? (
                            applications.map(app => (
    <div key={app.id} className="p-4 border-b border-gray-600">
        <div className="flex items-start justify-between">
            {/* ... Candidate & Status Info remains the same ... */}
            <div>
                <h3 className="text-xl font-semibold">{app.applicant_name}</h3>
                <p className="text-gray-400">Applied for: <span className="font-medium text-gray-300">{app.job_title}</span></p>
                <p className="text-sm text-gray-400">Email: {app.applicant_email}</p>
                <div className="mt-3">
                    <label htmlFor={`status-${app.id}`} className="text-sm font-medium text-gray-300 mr-2">Status:</label>
                    <select
                        id={`status-${app.id}`}
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-1.5"
                    >
                        <option value="received">Received</option>
                        <option value="under_review">Under Review</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="text-center">
                    <h4 className="text-sm font-semibold mb-1">ATS Score</h4>
                    <AtsScoreChart score={app.ats_score} />
                </div>
                {/* 2. Update the buttons to include icons */}
                <div className="flex flex-col space-y-2">
                    <button onClick={() => setSummaryAppId(app.id)} className="flex items-center text-sm text-green-400 hover:underline">
                        <FileText size={16} className="mr-1" /> AI Summary
                    </button>
                    <button onClick={() => setQuestionAppId(app.id)} className="flex items-center text-sm text-purple-400 hover:underline">
                        <BrainCircuit size={16} className="mr-1" /> AI Questions
                    </button>
                    <button onClick={() => setViewingAppId(app.id)} className="flex items-center text-sm text-blue-400 hover:underline">
                        <FileSearch size={16} className="mr-1" /> View Resume
                    </button>
                    <button onClick={() => toggleNotes(app.id)} className="flex items-center text-sm text-blue-400 hover:underline">
                        <MessageSquare size={16} className="mr-1" /> {expandedAppId === app.id ? 'Hide Notes' : 'View Notes'}
                    </button>
                </div>
            </div>
        </div>
        {expandedAppId === app.id && <NotesSection application={app} onNoteAdded={() => { const params = new URLSearchParams(filters); axiosInstance.get('/dashboard/hr/', { params }).then(res => setApplications(res.data)); }} />}
    </div>
))
                    ) : (
                        <p className="text-center text-gray-400 py-4">No applications match the current filters.</p>
                    )}
                </div>
            </div>

            {/* Conditionally render all modals */}
            {viewingAppId && <ResumeViewer applicationId={viewingAppId} onClose={() => setViewingAppId(null)} />}
            {questionAppId && <InterviewQuestionsModal applicationId={questionAppId} onClose={() => setQuestionAppId(null)} />}
            {summaryAppId && <ResumeSummaryModal applicationId={summaryAppId} onClose={() => setSummaryAppId(null)} />}
        </div>
    );
};

export default HRDashboard;