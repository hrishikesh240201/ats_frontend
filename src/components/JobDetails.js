// src/components/JobDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ApplyForm from './ApplyForm';

const JobDetails = () => {
    const { id } = useParams(); // Gets the job ID from the URL
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`)
            .then(response => {
                setJob(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching job details!', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!job) return <p>Job not found.</p>;

    return (
       <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
    <Link to="/" className="text-blue-400 hover:underline mb-4 inline-block">&larr; Back to Listings</Link>
    <h1 className="text-3xl font-bold text-white">{job.title}</h1>
    <p className="text-gray-400 mb-4">{job.location}</p>
    
    <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold text-white">Description</h2>
        <p>{job.description}</p>
        <h2 className="text-xl font-semibold mt-4 text-white">Requirements</h2>
        <p>{job.requirements}</p>
    </div>
            
             {!showForm ? (
                 <button onClick={() => setShowForm(true)} className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                    Apply for this Position
                </button>
            ) : (
                <ApplyForm jobId={job.id} onApplySuccess={() => setShowForm(false)} />
            )}
        </div>
    );
};

export default JobDetails;