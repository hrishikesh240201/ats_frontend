// src/components/ResumeFeedbackModal.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const ResumeFeedbackModal = ({ applicationId, onClose }) => {
    const [feedback, setFeedback] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axiosInstance.post('/generate-resume-feedback/', {
                    application_id: applicationId,
                });
                setFeedback(response.data.feedback);
            } catch (error) {
                console.error("Failed to fetch resume feedback", error);
                setFeedback(["Could not generate feedback at this time."]);
            }
            setIsLoading(false);
        };

        if (applicationId) {
            fetchFeedback();
        }
    }, [applicationId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">AI Resume Feedback</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                        &times;
                    </button>
                </div>
                <div className="text-gray-300">
                    {isLoading ? (
                        <p>Analyzing your resume...</p>
                    ) : (
                        <ul className="list-disc list-inside space-y-2">
                            {feedback.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeFeedbackModal;