// src/templates/ModernTemplate.js
import React from 'react';
import { Mail, Phone, Linkedin } from 'lucide-react';

export const ModernTemplate = React.forwardRef(({ resumeData }, ref) => {
    const { personal_info, experience, education, skills } = resumeData;

    return (
        <div ref={ref} className="p-8 bg-white text-gray-800 font-sans text-sm">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900">{personal_info?.name || 'Your Name'}</h1>
                <div className="flex justify-center items-center space-x-4 mt-2 text-xs text-gray-600">
                    <div className="flex items-center"><Mail size={12} className="mr-1" /> {personal_info?.email || 'your.email@example.com'}</div>
                    <div className="flex items-center"><Phone size={12} className="mr-1" /> {personal_info?.phone || '123-456-7890'}</div>
                    <div className="flex items-center"><Linkedin size={12} className="mr-1" /> {personal_info?.linkedin || 'linkedin.com/in/yourprofile'}</div>
                </div>
            </div>

            {/* Experience Section */}
            <div>
                <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Work Experience</h2>
                <div className="space-y-4">
                    {experience?.map((exp, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-md">{exp.title}</h3>
                                <p className="text-xs font-medium text-gray-600">{exp.dates}</p>
                            </div>
                            <p className="text-sm italic text-gray-700">{exp.company}, {exp.location}</p>
                            <ul className="list-disc list-inside mt-1 text-xs text-gray-600 space-y-1">
                                {exp.description?.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education Section */}
            <div className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Education</h2>
                <div className="space-y-2">
                    {education?.map((edu, index) => (
                        <div key={index} className="flex justify-between">
                            <div>
                                <h3 className="font-semibold text-md">{edu.degree}</h3>
                                <p className="text-sm italic text-gray-700">{edu.institution}</p>
                            </div>
                            <p className="text-xs font-medium text-gray-600">{edu.year}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills Section */}
            <div className="mt-6">
                <h2 className="text-lg font-bold border-b-2 border-gray-800 pb-1 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {/* --- THIS IS THE FIX --- */}
                    {/* We ensure that skills is always an array before mapping */}
                    {(Array.isArray(skills) ? skills : []).map((skill, index) => (
                        <span key={index} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
    );
});