// src/components/JobList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/jobs/')
            .then(response => {
                setJobs(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the jobs!', error);
            });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Open Positions</h1>
            <div className="space-y-4">
                {jobs.map(job => (
                    // Use Link to navigate to the job details page
                   <Link to={`/jobs/${job.id}`} key={job.id} className="block p-4 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-700">
                     <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                        <p className="text-gray-400">{job.location}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default JobList;