// src/components/ResumeSummaryModal.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ResumeSummaryModal = ({ applicationId, onClose }) => {
    const [summary, setSummary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await axiosInstance.post('/generate-resume-summary/', {
                    application_id: applicationId,
                });
                setSummary(response.data.summary);
            } catch (error) {
                console.error("Failed to fetch resume summary", error);
                setSummary(["Could not generate a summary at this time."]);
            }
            setIsLoading(false);
        };

        if (applicationId) {
            fetchSummary();
        }
    }, [applicationId]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">AI-Generated Resume Summary</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                        &times;
                    </button>
                </div>
                <div className="text-gray-300">
                    {isLoading ? (
                        <p>Generating summary...</p>
                    ) : (
                        <ul className="list-disc list-inside space-y-2">
                            {summary.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeSummaryModal;