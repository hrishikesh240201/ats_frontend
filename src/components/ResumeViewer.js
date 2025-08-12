// src/components/ResumeViewer.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ResumeViewer = ({ applicationId, onClose }) => {
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axiosInstance.get(`/applications/${applicationId}/resume/`, {
                    responseType: 'blob', // Important: tells axios to expect file data
                });

                // Create a temporary local URL from the received file data
                const url = URL.createObjectURL(response.data);
                setFileUrl(url);
            } catch (err) {
                console.error("Failed to fetch resume:", err);
                setError("Could not load resume.");
            }
        };

        if (applicationId) {
            fetchResume();
        }

        // Cleanup function to revoke the object URL when the component unmounts
        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [applicationId]); // Rerun when the application ID changes

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col border border-gray-700">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={onClose}
                        className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                        &times;
                    </button>
                </div>
                {error ? (
                    <div className="w-full h-full flex items-center justify-center text-red-400">{error}</div>
                ) : fileUrl ? (
                    <iframe
                        src={fileUrl}
                        title="Resume Viewer"
                        className="w-full h-full border-0 rounded"
                    ></iframe>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">Loading resume...</div>
                )}
            </div>
        </div>
    );
};

export default ResumeViewer;