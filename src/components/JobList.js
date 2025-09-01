import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // We use standard axios here as it's a public page
import Spinner from './Spinner';
import { MapPin } from 'lucide-react';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch only active job postings
                const response = await axios.get('http://127.0.0.1:8000/api/jobs/?is_active=true');
                setJobs(response.data);
            } catch (error) {
                console.error('There was an error fetching the jobs!', error);
            }
            setIsLoading(false);
        };
        fetchJobs();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Find Your Next Opportunity</h1>
                <p className="mt-4 text-lg leading-8 text-gray-400">Browse our open positions and start your journey with us today.</p>
            </div>

            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map(job => (
                        <Link 
                            to={`/jobs/${job.id}`} 
                            key={job.id} 
                            className="block p-6 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                        >
                            <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                            <div className="flex items-center text-gray-400 mt-2">
                                <MapPin size={16} className="mr-2" />
                                <span>{job.location}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-4 h-16 overflow-hidden text-ellipsis">
                                {job.description.substring(0, 150)}...
                            </p>
                            <div className="mt-4 text-right text-blue-400 font-semibold">
                                View Details &rarr;
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No open positions at the moment. Please check back later.</p>
            )}
        </div>
    );
};

export default JobList;
