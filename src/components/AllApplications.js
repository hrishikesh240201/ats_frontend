// src/components/AllApplications.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from './Spinner';

const AllApplications = () => {
    const [applications, setApplications] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        job: '',
        ordering: '-potential_score' // Default sort by Potential Score
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
                if (filters.ordering) params.append('ordering', filters.ordering);

                const response = await axiosInstance.get('/all-applications/', { params });
                setApplications(response.data);
            } catch (error) {
                console.error('Failed to fetch all applications data', error);
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

    if (!applications) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">All Candidate Applications</h2>
                <Link to="/manage-jobs" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Manage Job Postings
                </Link>
            </div>

            {/* Filter Section */}
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <select
                    name="ordering"
                    value={filters.ordering}
                    onChange={handleFilterChange}
                    className="p-2 border rounded bg-gray-700 text-white border-gray-600"
                >
                    <option value="-potential_score">Sort by Potential Score (High to Low)</option>
                    <option value="potential_score">Sort by Potential Score (Low to High)</option>
                    <option value="-ats_score">Sort by ATS Score (High to Low)</option>
                    <option value="ats_score">Sort by ATS Score (Low to High)</option>
                    <option value="-applied_at">Sort by Newest</option>
                    <option value="applied_at">Sort by Oldest</option>
                </select>
            </div>

            {/* Card-Based Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.length > 0 ? (
                    applications.map(app => (
                        <Link 
                            to={`/application/${app.id}`} 
                            key={app.id} 
                            className="block p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="text-lg font-semibold">{app.applicant_name}</h3>
                                    <p className="text-sm text-gray-400">for {app.job_title}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                                    app.status === 'hired' ? 'bg-green-500/20 text-green-400' : 
                                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {app.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center justify-around bg-gray-800 p-2 rounded-md">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Potential Score</p>
                                    <p className="text-xl font-bold text-yellow-400">{app.potential_score}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-400">ATS Match</p>
                                    <p className="text-xl font-bold">{app.ats_score}%</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400 py-10">No applications match the current filters.</p>
                )}
            </div>
        </div>
    );
};

export default AllApplications;
