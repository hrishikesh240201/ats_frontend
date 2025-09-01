import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Upload, ClipboardList, CheckCircle, XCircle, Lightbulb, ScanLine } from 'lucide-react';
import Spinner from './Spinner';

const ResumeScanner = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile || !jobDescription.trim()) {
            toast.error("Please upload a resume and paste a job description.");
            return;
        }

        setIsLoading(true);
        setAnalysisResult(null);
        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('job_description', jobDescription);

        try {
            const response = await axiosInstance.post('/scan-resume/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAnalysisResult(response.data);
            toast.success("Analysis complete!");
        } catch (error) {
            console.error("Failed to scan resume", error);
            toast.error("Failed to analyze resume. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Input Form */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 flex items-center"><ClipboardList className="mr-3" /> Scan Your Resume</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Upload Your Resume</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-400 text-center">{resumeFile ? resumeFile.name : <><span className="font-semibold">Click to upload</span> or drag and drop</>}</p>
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} accept=".pdf,.docx" />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Paste Job Description</label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the full job description here..."
                            required
                            className="w-full p-2 border rounded h-40 bg-gray-700 text-white border-gray-600"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center"
                    >
                        {isLoading ? <Spinner /> : <><ScanLine className="mr-2" /> Analyze My Resume</>}
                    </button>
                </form>
            </div>

            {/* Right Column: Analysis Report */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 sticky top-8">
                 <h3 className="text-2xl font-bold mb-4">Analysis Report</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full"><Spinner /></div>
                ) : analysisResult ? (
                    <div className="space-y-6">
                        {/* Score */}
                        <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-lg">
                            <p className="text-lg text-gray-400">ATS Match Score</p>
                            <p className="text-6xl font-bold text-yellow-400">{analysisResult.ats_score}%</p>
                        </div>
                        {/* Keywords */}
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center"><CheckCircle className="mr-2 text-green-400" /> Matching Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.matching_keywords.length > 0 ? 
                                    analysisResult.matching_keywords.map(kw => <span key={kw} className="bg-green-500/20 text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{kw}</span>) :
                                    <p className="text-sm text-gray-500">No matching keywords found.</p>
                                }
                            </div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center"><XCircle className="mr-2 text-red-400" /> Missing Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.missing_keywords.length > 0 ?
                                    analysisResult.missing_keywords.map(kw => <span key={kw} className="bg-red-500/20 text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{kw}</span>) :
                                    <p className="text-sm text-gray-500">No critical keywords seem to be missing. Great job!</p>
                                }
                            </div>
                        </div>
                        {/* AI Feedback */}
                        <div className="bg-gray-800 p-4 rounded-lg">
                             <h4 className="font-semibold mb-3 flex items-center"><Lightbulb className="mr-2 text-yellow-400" /> AI Suggestions</h4>
                             <ul className="list-disc list-inside space-y-2 text-gray-300">
                                {analysisResult.feedback_points.map((point, i) => <li key={i}>{point}</li>)}
                             </ul>
                        </div>
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <ScanLine size={48} className="mb-4" />
                        <p>Your analysis report will appear here after you scan your resume.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeScanner;
