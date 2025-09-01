
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from './Spinner';
import AtsScoreChart from './AtsScoreChart';
import NotesSection from './NotesSection';
import InterviewQuestionsModal from './InterviewQuestionsModal';
import ResumeSummaryModal from './ResumeSummaryModal';
import OutreachEmailModal from './OutreachEmailModal';
import { FileText, MessageSquare, BrainCircuit, Mail, Bot, Star, ShieldCheck, Github, Code, Briefcase, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RankScoreChart = ({ score }) => (
    <div className="relative w-24 h-24">
        <AtsScoreChart score={score} />
        <Star className="absolute top-1 right-1 text-yellow-400" size={16} />
    </div>
);

const ScoreDisplay = ({ title, score, icon, color }) => (
    <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full border-4 ${color} flex items-center justify-center mb-1`}>
            {icon}
        </div>
        <p className="text-2xl font-bold">{score}</p>
        <p className="text-xs text-gray-400">{title}</p>
    </div>
);

const CandidateDetailView = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // State for modals
    const [questionAppId, setQuestionAppId] = useState(null);
    const [summaryAppId, setSummaryAppId] = useState(null);
    const [emailApp, setEmailApp] = useState(null);

    // Using useCallback to memoize the function
    const fetchApplication = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/applications/${id}/`);
            setApplication(response.data);
            return response.data; // Return data for polling
        } catch (error) {
            console.error("Failed to fetch application details", error);
            return null;
        }
    }, [id]);

    useEffect(() => {
        setIsLoading(true);
        fetchApplication().then(() => {
            setIsLoading(false);
        });
    }, [fetchApplication]);

    useEffect(() => {
        const fetchResume = async () => {
            if (application) {
                try {
                    const response = await axiosInstance.get(`/applications/${application.id}/resume/`, {
                        responseType: 'blob',
                    });
                    const url = URL.createObjectURL(response.data);
                    setResumeUrl(url);
                } catch (err) {
                    console.error("Failed to fetch resume:", err);
                }
            }
        };
        fetchResume();

        return () => {
            if (resumeUrl) {
                URL.revokeObjectURL(resumeUrl);
            }
        };
    }, [application]);

    const handleStatusChange = async (newStatus) => {
        try {
            await axiosInstance.patch(`/applications/${id}/status/`, { status: newStatus });
            toast.success("Status updated!");
            fetchApplication();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const handleRunAnalysis = async () => {
        setIsAnalyzing(true);
        const toastId = toast.loading("Starting deep AI analysis... This may take a moment.", { id: 'analysis' });
        try {
            await axiosInstance.post(`/applications/${id}/run-analysis/`);

            // Poll for results
            const interval = setInterval(async () => {
                const updatedApp = await fetchApplication();
                if (updatedApp && (updatedApp.github_analysis || !updatedApp.github_url)) {
                    clearInterval(interval);
                    setIsAnalyzing(false);
                    toast.success("AI analysis complete!", { id: 'analysis' });
                }
            }, 5000); // Check every 5 seconds
        } catch (error) {
            toast.error("Failed to start analysis.", { id: 'analysis' });
            setIsAnalyzing(false);
        }
    };

    const handleInitiateScreening = async (applicationId) => {
        const toastId = toast.loading("Preparing screening questions...");
        try {
            await axiosInstance.post('/screening/initiate/', {
                application_id: applicationId
            });
            // After initiating, start polling for the result
            const interval = setInterval(async () => {
                const updatedApp = await fetchApplication();
                if (updatedApp && updatedApp.screening_session && updatedApp.screening_session.status === 'pending') {
                    clearInterval(interval);
                    toast.success("Screening is ready to be sent!", { id: toastId });
                }
            }, 3000); // Check every 3 seconds

        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to initiate screening.", { id: toastId });
        }
    };

    if (isLoading || !application) {
        return <Spinner />;
    }
    
    // Determine the screening button state
    const screeningSession = application.screening_session;
    let screeningButton;
    if (!screeningSession || screeningSession.status === 'generating_questions') {
        const isPreparing = screeningSession?.status === 'generating_questions';
        screeningButton = (
            <button 
                onClick={() => !isPreparing && handleInitiateScreening(application.id)}
                disabled={isPreparing}
                className="w-full flex items-center justify-center text-sm text-cyan-400 p-2 rounded hover:bg-gray-800 disabled:opacity-50"
            >
                {isPreparing ? <><RefreshCw size={16} className="mr-2 animate-spin" /> Preparing...</> : <><Bot size={16} className="mr-2" /> Start AI Screening</>}
            </button>
        );
    } else if (screeningSession.status === 'pending') {
        const screeningLink = `${window.location.origin}/screening/${screeningSession.id}`;
        screeningButton = (
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(screeningLink);
                    toast.success("Screening link copied to clipboard!");
                }}
                className="w-full flex items-center justify-center text-sm bg-green-600 text-white font-bold p-2 rounded hover:bg-green-700"
            >
                <CheckCircle size={16} className="mr-2" /> Copy Screening Link
            </button>
        );
    } else { // completed
         screeningButton = (
            <div className="w-full text-center text-sm text-gray-400 p-2">Screening Completed</div>
        );
    }


    return (
        <div>
            <Link to="/all-applications" className="text-blue-400 hover:underline mb-6 inline-block">&larr; Back to All Applications</Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 rounded-lg border border-gray-700 h-[80vh]">
                        {resumeUrl ? (
                            <iframe
                                src={resumeUrl}
                                title="Resume Viewer"
                                className="w-full h-full border-0 rounded"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full">Loading resume...</div>
                        )}
                    </div>
                    {/* GitHub Analysis Section */}
                    {application.github_url && (
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-bold mb-3 flex items-center"><Github size={20} className="mr-2" /> AI GitHub Analysis</h3>
                            {application.analysis_status === 'completed' && application.github_analysis ? (
                                <div className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{application.github_analysis}</div>
                            ) : application.analysis_status === 'in_progress' || isAnalyzing ? (
                                <div className="text-center text-gray-400 p-4">
                                    <p>AI analysis is in progress. Please check back in a moment.</p>
                                    <button onClick={fetchApplication} className="mt-2 text-sm text-blue-400 hover:underline">Refresh</button>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="text-gray-400">Run deep analysis to see GitHub insights.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-2xl font-bold">{application.applicant_name}</h3>
                        <p className="text-gray-400">{application.applicant_email}</p>
                        <p className="text-sm text-gray-500 mt-1">Applied for: {application.job_title}</p>
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-300 mr-2">Status:</label>
                            <select
                                value={application.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-1.5"
                            >
                                <option value="received">Received</option>
                                <option value="under_review">Under Review</option>
                                <option value="interview">Interview</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-bold">AI Potential Score</h3>
                             {application.analysis_status !== 'completed' && !isAnalyzing && (
                                <button onClick={handleRunAnalysis} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                    Start Deep Analysis
                                </button>
                             )}
                        </div>
                        {isAnalyzing || application.analysis_status === 'in_progress' ? (
                            <div className="text-center text-gray-400 p-4">Analysis in progress...</div>
                        ) : application.analysis_status === 'completed' ? (
                            <>
                                <p className="text-4xl font-bold text-center text-yellow-400 mb-4">{application.potential_score} / 100</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <ScoreDisplay title="Tech Screen" score={application.technical_score} icon={<ShieldCheck size={24} />} color="border-green-400" />
                                    <ScoreDisplay title="GitHub Strength" score={application.github_score} icon={<Github size={24} />} color="border-purple-400" />
                                    <ScoreDisplay title="Problem Solving" score={application.problem_solving_score} icon={<Code size={24} />} color="border-cyan-400" />
                                    <ScoreDisplay title="Internship Quality" score={application.internship_score} icon={<Briefcase size={24} />} color="border-pink-400" />
                                </div>
                            </>
                        ) : (
                             <p className="text-center text-gray-500 p-4">Run deep analysis to see scores.</p>
                        )}
                    </div>
                    
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-lg font-bold mb-3">AI Tools</h3>
                        <div className="space-y-2">
                             {screeningButton}
                             <button onClick={() => setEmailApp(application)} className="w-full flex items-center text-sm text-yellow-400 hover:text-yellow-300 p-2 rounded hover:bg-gray-800">
                                <Mail size={16} className="mr-2" /> Generate Email
                            </button>
                            <button onClick={() => setSummaryAppId(application.id)} className="w-full flex items-center text-sm text-green-400 hover:text-green-300 p-2 rounded hover:bg-gray-800">
                                <FileText size={16} className="mr-2" /> AI Summary
                            </button>
                            <button onClick={() => setQuestionAppId(application.id)} className="w-full flex items-center text-sm text-purple-400 hover:text-purple-300 p-2 rounded hover:bg-gray-800">
                                <BrainCircuit size={16} className="mr-2" /> AI Questions
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg border border-gray-700">
                         <NotesSection application={application} onNoteAdded={fetchApplication} />
                    </div>
                </div>
            </div>

            {questionAppId && <InterviewQuestionsModal applicationId={questionAppId} onClose={() => setQuestionAppId(null)} />}
            {summaryAppId && <ResumeSummaryModal applicationId={summaryAppId} onClose={() => setSummaryAppId(null)} />}
            {emailApp && <OutreachEmailModal application={emailApp} onClose={() => setEmailApp(null)} />}
        </div>
    );
};

export default CandidateDetailView;


