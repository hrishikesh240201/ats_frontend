// src/components/ApplyForm.js
import React, { useState, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ApplyForm = ({ jobId, onApplySuccess }) => {
    const [resume, setResume] = useState(null);
    const [githubUrl, setGithubUrl] = useState(''); // State for GitHub URL
    const [error, setError] = useState('');
    const { authTokens } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!resume) {
            setError('Please upload a resume.');
            return;
        }

        const formData = new FormData();
        formData.append('job', jobId);
        formData.append('resume', resume);
        if (githubUrl) {
            formData.append('github_url', githubUrl);
        }

        axiosInstance.post('/applications/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authTokens.access}`
            },
        })
        .then(response => {
            toast.success('Application submitted successfully!');
            onApplySuccess();
        })
        .catch(error => {
            console.error('There was an error submitting the application!', error);
            setError('Something went wrong. Please try again.');
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Apply Now</h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">Upload Resume (Required)</label>
                    <input 
                        type="file" 
                        onChange={e => setResume(e.target.files[0])} 
                        required 
                        className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-300">GitHub Profile URL (Optional)</label>
                    <input 
                        type="url"
                        placeholder="https://github.com/your-username"
                        value={githubUrl}
                        onChange={e => setGithubUrl(e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                    />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    Submit Application
                </button>
            </div>
        </form>
    );
};

export default ApplyForm;