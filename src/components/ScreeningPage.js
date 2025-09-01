import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Use the regular axios for this public page
import { toast } from 'react-hot-toast';
import Spinner from './Spinner';

const ScreeningPage = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                // This GET request now triggers question generation on the backend
                // if the questions are not already prepared.
                const response = await axios.get(`http://127.0.0.1:8000/api/screening/session/${sessionId}/`);
                setSession(response.data);
                // Initialize an empty answer for each question
                setAnswers(Array(response.data.questions.length).fill(''));
            } catch (error) {
                console.error("Failed to fetch screening session", error);
                toast.error("Invalid or expired screening link.");
            }
            setIsLoading(false);
        };
        fetchSession();
    }, [sessionId]);

    const handleNextQuestion = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = currentAnswer;
        setAnswers(newAnswers);
        setCurrentAnswer(answers[currentQuestionIndex + 1] || '');
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handlePrevQuestion = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = currentAnswer;
        setAnswers(newAnswers);
        setCurrentAnswer(answers[currentQuestionIndex - 1] || '');
        setCurrentQuestionIndex(currentQuestionIndex - 1);
    };

    const handleFinalSubmit = async () => {
        setIsSubmitting(true);
        const finalAnswers = [...answers];
        finalAnswers[currentQuestionIndex] = currentAnswer;

        // Format the transcript
        const transcript = session.questions.map((question, index) => ({
            question: question,
            answer: finalAnswers[index]
        }));

        try {
            await axios.patch(`http://127.0.0.1:8000/api/screening/session/${sessionId}/`, {
                transcript: transcript,
            });
            setIsComplete(true);
            toast.success("Screening complete! Thank you.");
        } catch (error) {
            toast.error("Failed to submit answers. Please try again.");
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold mb-4">Preparing your screening questions...</h2>
                <p className="text-gray-400">This may take a moment. Please do not refresh the page.</p>
                <Spinner />
            </div>
        );
    }
    
    if (!session || !session.questions || session.questions.length === 0) {
        return <div className="text-center p-10 text-red-400">Could not load screening questions. The session may be invalid or an error occurred.</div>;
    }
    
    if (isComplete) {
        return <div className="text-center p-10 text-green-400">Your screening is complete. You may now close this window.</div>;
    }

    const progressPercentage = ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-2 text-center">AI Screening Interview</h2>
            <p className="text-sm text-gray-400 text-center mb-4">Please provide detailed answers to the following questions.</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>

            <div className="bg-gray-800 p-4 rounded mb-4">
                <p className="font-semibold text-gray-300">Question {currentQuestionIndex + 1} of {session.questions.length}:</p>
                <p className="text-lg text-white mt-1 whitespace-pre-wrap">{session.questions[currentQuestionIndex]}</p>
            </div>
            
            <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-2 border rounded h-40 bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                    Previous
                </button>
                {currentQuestionIndex < session.questions.length - 1 ? (
                    <button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Final Answers'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ScreeningPage;