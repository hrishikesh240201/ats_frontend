// src/components/InterviewQuestionsModal.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const InterviewQuestionsModal = ({ applicationId, onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axiosInstance.post('/generate-interview-questions/', {
                    application_id: applicationId,
                });
                setQuestions(response.data.questions);
            } catch (error) {
                console.error("Failed to fetch interview questions", error);
                setQuestions(["Could not generate questions at this time."]);
            }
            setIsLoading(false);
        };

        if (applicationId) {
            fetchQuestions();
        }
    }, [applicationId]);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">AI-Generated Interview Questions</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                        &times;
                    </button>
                </div>
                <div className="text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
            <p>Generating questions...</p>
        ) : (
            <ul className="list-disc list-inside space-y-2">
                {questions.map((q, index) => (
                    <li key={index}>{q}</li>
                ))}
            </ul>
        )}
    </div>
            </div>
        </div>
    );
};

export default InterviewQuestionsModal;