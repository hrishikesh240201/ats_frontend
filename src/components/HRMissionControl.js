// src/components/HRMissionControl.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import TaskManager from './TaskManager';
import Spinner from './Spinner';
import { Briefcase, UserPlus, UserCheck } from 'lucide-react';

const HRMissionControl = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosInstance.get('/dashboard/mission-control/');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch mission control data", error);
            }
            setIsLoading(false);
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area (Left) */}
            <div className="lg:col-span-2 space-y-8">
                {/* Key Metrics Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 flex items-center">
                            <Briefcase size={40} className="text-blue-400 mr-4" />
                            <div>
                                <p className="text-3xl font-bold">{data?.key_metrics.open_positions}</p>
                                <p className="text-gray-400">Open Positions</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 flex items-center">
                            <UserPlus size={40} className="text-green-400 mr-4" />
                            <div>
                                <p className="text-3xl font-bold">{data?.key_metrics.new_applicants_today}</p>
                                <p className="text-gray-400">New Applicants Today</p>
                            </div>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 flex items-center">
                            <UserCheck size={40} className="text-yellow-400 mr-4" />
                            <div>
                                <p className="text-3xl font-bold">{data?.key_metrics.under_review}</p>
                                <p className="text-gray-400">Candidates Under Review</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Recent Activity</h2>
                        <Link to="/all-applications" className="text-blue-400 hover:underline">
                            View All Applications &rarr;
                        </Link>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-3">
                        {data?.recent_activity.map(app => (
                            <div key={app.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                <div>
                                    <p className="font-semibold">{app.applicant_name}</p>
                                    <p className="text-sm text-gray-400">applied for {app.job_title}</p>
                                </div>
                                <p className="text-xs text-gray-500">{new Date(app.applied_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Assistant Sidebar (Right) */}
            <div className="lg:col-span-1">
                <TaskManager />
            </div>
        </div>
    );
};

export default HRMissionControl;
