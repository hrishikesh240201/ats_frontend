import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';
import ApplyForm from './ApplyForm'; // We already have the form logic in a separate component
import { MapPin } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // The URL was incorrect here in previous versions, this is the correct one from the router
                const response = await axios.get(`http://127.0.0.1:8000/api/jobs/${id}/`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details!', error);
            }
            setIsLoading(false);
        };
        fetchJob();
    }, [id]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!job) {
        return <div className="text-center text-red-400">Job not found or has been closed.</div>;
    }

    return (
        <div>
            <Link to="/" className="text-blue-400 hover:underline mb-8 inline-block">&larr; Back to All Listings</Link>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Job Information */}
                <div className="lg:w-2/3">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                        <h1 className="text-3xl font-bold text-white">{job.title}</h1>
                        <div className="flex items-center text-gray-400 mt-2 mb-6">
                            <MapPin size={16} className="mr-2" />
                            <span>{job.location}</span>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                            <h2 className="text-xl font-semibold text-white">Description</h2>
                            <p>{job.description}</p>
                            <h2 className="text-xl font-semibold mt-6 text-white">Requirements</h2>
                            <p style={{ whiteSpace: 'pre-line' }}>{job.requirements}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Apply Form */}
                <div className="lg:w-1/3">
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 sticky top-8">
                         <ApplyForm jobId={job.id} onApplySuccess={() => { /* Maybe show a success message */ }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
