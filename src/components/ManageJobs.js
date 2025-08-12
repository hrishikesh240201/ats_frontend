// src/components/ManageJobs.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import JobForm from './JobForm'; // Import the form
import axiosInstance from '../utils/axiosInstance';

const ManageJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const { authTokens } = useContext(AuthContext);

    const fetchJobs = async () => {
        try {
             const response = await axiosInstance.get('/jobs/');
            setJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSave = async (jobData) => {
        
        const url = editingJob 
            ? `http://127.0.0.1:8000/api/jobs/${editingJob.id}/` 
            : 'http://127.0.0.1:8000/api/jobs/';
        const method = editingJob ? 'put' : 'post';

        try {
            await axiosInstance[method](url, jobData);
            fetchJobs(); // Refresh the list
            setIsFormOpen(false);
            setEditingJob(null);
        } catch (error) {
            console.error("Failed to save job", error);
            alert("Error: Could not save job posting.");
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job posting?")) {
            try {
                await axiosInstance.delete(`/jobs/${jobId}/`);
                fetchJobs(); // Refresh the list
            } catch (error) {
                console.error("Failed to delete job", error);
                alert("Error: Could not delete job posting.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Job Postings</h2>
                <button onClick={() => { setEditingJob(null); setIsFormOpen(true); }} className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    + Add New Job
                </button>
            </div>

           <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="p-4 border-b border-gray-600 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-600">{job.location}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => { setEditingJob(job); setIsFormOpen(true); }} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Edit</button>
                            <button onClick={() => handleDelete(job.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {isFormOpen && <JobForm job={editingJob} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
        </div>
    );
};

export default ManageJobs;