// src/components/ResumeBuilder.js
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import Spinner from './Spinner';
import { Save, Plus, Trash2, Wand2, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { ModernTemplate } from '../templates/ModernTemplate';

// A custom hook to manage the form state
const useResumeData = () => {
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await axiosInstance.get('/my-resume/');
                setResumeData(response.data);
            } catch (error) {
                console.error("Failed to fetch resume data", error);
                toast.error("Could not load your resume data.");
            }
            setIsLoading(false);
        };
        fetchResume();
    }, []);

    const updateField = (section, field, value) => {
        if (field) {
            setResumeData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setResumeData(prev => ({
                ...prev,
                [section]: value
            }));
        }
    };

    const updateListItem = (section, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const addListItem = (section, newItem) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), newItem]
        }));
    };

    const removeListItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    return { resumeData, isLoading, updateField, updateListItem, addListItem, removeListItem };
};


const ResumeBuilder = () => {
    const { resumeData, isLoading, updateField, updateListItem, addListItem, removeListItem } = useResumeData();
    const [isImproving, setIsImproving] = useState(null);
    const componentRef = useRef();

    // --- THIS IS THE NEW, MORE ROBUST PRINT LOGIC ---
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${resumeData?.personal_info?.name || 'resume'}-resume`,
        onAfterPrint: () => toast.success('Resume downloaded!'),
    });

    const handleSave = async () => {
        const toastId = toast.loading("Saving resume...");
        try {
            await axiosInstance.put('/my-resume/', resumeData);
            toast.success("Resume saved successfully!", { id: toastId });
        } catch (error) {
            toast.error("Failed to save resume.", { id: toastId });
        }
    };

    const handleImproveText = async (index, originalText) => {
        if (!originalText || !originalText.trim()) {
            toast.error("Please write a description first.");
            return;
        }
        setIsImproving(index);
        try {
            const response = await axiosInstance.post('/improve-text/', { text: originalText });
            updateListItem('experience', index, 'description', response.data.improved_text);
            toast.success("Description improved with AI!");
        } catch (error) {
            toast.error("Could not improve text at this time.");
        }
        setIsImproving(null);
    };

    if (isLoading || !resumeData) {
        return <Spinner />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Form Inputs */}
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold">AI-Powered Resume Builder</h2>
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 flex items-center">
                        <Save size={18} className="mr-2" /> Save Resume
                    </button>
                </div>

                {/* Personal Info Section */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" value={resumeData.personal_info?.name || ''} onChange={(e) => updateField('personal_info', 'name', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                        <input type="email" placeholder="Email Address" value={resumeData.personal_info?.email || ''} onChange={(e) => updateField('personal_info', 'email', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                        <input type="tel" placeholder="Phone Number" value={resumeData.personal_info?.phone || ''} onChange={(e) => updateField('personal_info', 'phone', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                        <input type="url" placeholder="LinkedIn Profile URL" value={resumeData.personal_info?.linkedin || ''} onChange={(e) => updateField('personal_info', 'linkedin', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                    </div>
                </div>

                {/* Experience Section */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
                    <div className="space-y-4">
                        {resumeData.experience?.map((exp, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded relative">
                                <button onClick={() => removeListItem('experience', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Job Title" value={exp.title || ''} onChange={(e) => updateListItem('experience', index, 'title', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                    <input type="text" placeholder="Company Name" value={exp.company || ''} onChange={(e) => updateListItem('experience', index, 'company', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                    <input type="text" placeholder="Location" value={exp.location || ''} onChange={(e) => updateListItem('experience', index, 'location', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                    <input type="text" placeholder="Dates (e.g., Jan 2022 - Present)" value={exp.dates || ''} onChange={(e) => updateListItem('experience', index, 'dates', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                </div>
                                <div className="mt-4 relative">
                                    <textarea placeholder="Description of your responsibilities and achievements..." value={exp.description || ''} onChange={(e) => updateListItem('experience', index, 'description', e.target.value)} className="w-full p-2 border rounded h-24 bg-gray-700 text-white border-gray-600"></textarea>
                                    <button
                                        onClick={() => handleImproveText(index, exp.description)}
                                        disabled={isImproving === index}
                                        className="absolute bottom-2 right-2 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700 disabled:bg-purple-400"
                                        title="Improve with AI"
                                    >
                                        <Wand2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => addListItem('experience', {})} className="mt-4 text-blue-400 hover:underline flex items-center"><Plus size={18} className="mr-1" /> Add Experience</button>
                </div>

                {/* Education Section */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Education</h3>
                    <div className="space-y-4">
                        {resumeData.education?.map((edu, index) => (
                            <div key={index} className="p-4 bg-gray-800 rounded relative">
                                 <button onClick={() => removeListItem('education', index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Degree or Certificate" value={edu.degree || ''} onChange={(e) => updateListItem('education', index, 'degree', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                    <input type="text" placeholder="Institution Name" value={edu.institution || ''} onChange={(e) => updateListItem('education', index, 'institution', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                    <input type="text" placeholder="Graduation Year" value={edu.year || ''} onChange={(e) => updateListItem('education', index, 'year', e.target.value)} className="p-2 border rounded bg-gray-700 text-white border-gray-600" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => addListItem('education', {})} className="mt-4 text-blue-400 hover:underline flex items-center"><Plus size={18} className="mr-1" /> Add Education</button>
                </div>

                {/* Skills Section */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-xl font-semibold mb-4">Skills</h3>
                    <p className="text-sm text-gray-400 mb-2">Enter skills separated by commas.</p>
                    <textarea 
                        placeholder="e.g., Python, Django, React, PostgreSQL, AWS..." 
                        value={Array.isArray(resumeData.skills) ? resumeData.skills.join(', ') : ''}
                        onChange={(e) => updateField('skills', null, e.target.value.split(',').map(s => s.trim()))}
                        className="w-full p-2 border rounded h-24 bg-gray-700 text-white border-gray-600"
                    ></textarea>
                </div>
            </div>

            {/* Right Column: Preview & Download */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                     <h3 className="text-xl font-semibold">Live Preview</h3>
                     <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 flex items-center">
                        <Download size={18} className="mr-2" /> Download as PDF
                    </button>
                </div>
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-2">
                    {/* --- THIS IS THE FIX --- */}
                    {/* The component to be printed is now completely separate and only for printing */}
                    <div className="hidden">
                        <ModernTemplate ref={componentRef} resumeData={resumeData} />
                    </div>
                    {/* This is the visible preview, it is NOT used for printing */}
                    <div className="h-[80vh] overflow-y-auto">
                        <ModernTemplate resumeData={resumeData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;