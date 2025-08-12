// src/components/CandidateDashboard.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AtsScoreChart from './AtsScoreChart';
import Spinner from './Spinner';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true); // Start loading
            try {
                const response = await axiosInstance.get('/dashboard/candidate/');
                setApplications(response.data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
            }
            setIsLoading(false); // Finish loading
        };
        fetchApplications();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    // Helper to get color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'hired':
                return 'text-green-400';
            case 'rejected':
                return 'text-red-400';
            case 'interview':
                return 'text-yellow-400';
            default:
                return 'text-blue-400';
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">My Applications</h2>
            <div className="space-y-4">
                {applications.length > 0 ? (
                    applications.map(app => (
                        <div key={app.id} className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-semibold">{app.job_title}</h3>
                                <p className="text-gray-400">Applied on: {new Date(app.applied_at).toLocaleDateString()}</p>
                                {/* --- DISPLAY STATUS --- */}
                                <p className="mt-2 text-gray-300">
                                    Status: <span className={`font-semibold ${getStatusColor(app.status)}`}>
                                        {app.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </p>
                            </div>
                            <div className="text-center">
                                <h4 className="text-sm font-semibold mb-1">ATS Score</h4>
                                <AtsScoreChart score={app.ats_score} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>You have not submitted any applications yet.</p>
                )}
            </div>
        </div>
    );
};

export default CandidateDashboard;