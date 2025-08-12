// src/components/JobForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const JobForm = ({ job, onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');
    const [location, setLocation] = useState('');
    
    // --- State for AI feature ---
    const [keywords, setKeywords] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        if (job) {
            setTitle(job.title);
            setDescription(job.description);
            setRequirements(job.requirements);
            setLocation(job.location);
        }
    }, [job]);

    const handleGenerate = async () => {
        if (!title) {
            alert("Please enter a Job Title before generating.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await axiosInstance.post('/generate-description/', { title, keywords });

            setDescription(response.data.description);
            setRequirements(response.data.requirements);
        } catch (error) {
            console.error("Failed to generate description", error);
            alert("Error: Could not generate description.");
        }
        setIsGenerating(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ title, description, requirements, location });
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-white">{job ? 'Edit Job' : 'Add New Job'}</h2>
                
                {/* Main form starts here */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Job Title is now part of the main form but used by the AI */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-300">Job Title</label>
                        <input type="text" placeholder="e.g., Senior Python Developer" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600" />
                    </div>

                    {/* --- Simplified AI Generator Section --- */}
                    <div className="p-4 bg-gray-700 rounded-lg">
                        <label className="block mb-1 text-sm font-medium text-gray-300">Keywords for AI</label>
                        <div className="flex items-center space-x-2">
                            <input type="text" placeholder="e.g., Django, REST API, PostgreSQL" value={keywords} onChange={e => setKeywords(e.target.value)} className="w-full p-2 border rounded bg-gray-600 text-white border-gray-500" />
                            <button type="button" onClick={handleGenerate} disabled={isGenerating} className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 disabled:bg-purple-400 whitespace-nowrap">
                                {isGenerating ? 'Generating...' : '✨ Generate'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-300">Description</label>
                        <textarea placeholder="Description will be generated here..." value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded h-24 bg-gray-700 text-white border-gray-600"></textarea>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-300">Requirements</label>
                        <textarea placeholder="Requirements will be generated here..." value={requirements} onChange={e => setRequirements(e.g.target.value)} required className="w-full p-2 border rounded h-24 bg-gray-700 text-white border-gray-600"></textarea>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-300">Location</label>
                        <input type="text" placeholder="e.g., Pune, India or Remote" value={location} onChange={e => setLocation(e.target.value)} required className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600" />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Save Job</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobForm;