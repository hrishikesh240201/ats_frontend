// src/components/OutreachEmailModal.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Mail } from 'lucide-react';

const OutreachEmailModal = ({ application, onClose }) => {
    const [emailType, setEmailType] = useState('under_review'); // Default to the first logical step
    const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleGenerateEmail = async (type) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/generate-outreach-email/', {
                application_id: application.id,
                email_type: type,
            });
            setEmailContent(response.data);
        } catch (error) {
            console.error("Failed to generate email", error);
            toast.error("Could not generate email.");
        }
        setIsLoading(false);
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        const toastId = toast.loading("Sending email...");

        try {
            await axiosInstance.post('/send-email/', {
                recipient_email: application.applicant_email,
                subject: emailContent.subject,
                body: emailContent.body,
            });
            toast.success("Email sent successfully!", { id: toastId });
            onClose();
        } catch (error) {
            console.error("Failed to send email", error);
            toast.error("Failed to send email. Please check server logs.", { id: toastId });
        }
        setIsSending(false);
    };
    
    // Automatically generate the email when the modal opens or the type changes
    useEffect(() => {
        handleGenerateEmail(emailType);
    }, [emailType]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Send Outreach Email</h3>
                    <button
                        onClick={onClose}
                        className="text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                    <label className="text-gray-300">Email Type:</label>
                    <select
                        value={emailType}
                        onChange={(e) => setEmailType(e.target.value)}
                        className="p-2 border rounded bg-gray-700 text-white border-gray-600"
                    >
                        {/* --- UPDATED OPTIONS --- */}
                        <option value="under_review">Application Under Review</option>
                        <option value="screening_invitation">AI Screening Invitation</option>
                        <option value="hr_interview">HR Interview Invitation</option>
                        <option value="rejection">Rejection Email</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="text-center py-10">Generating email content...</div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Subject</label>
                            <input 
                                type="text"
                                value={emailContent.subject}
                                onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                                className="mt-1 p-2 w-full bg-gray-800 rounded border border-gray-600 text-gray-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Body</label>
                            <textarea
                                value={emailContent.body}
                                onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                                className="mt-1 p-2 w-full bg-gray-800 rounded border border-gray-600 text-gray-300 h-64 overflow-y-auto whitespace-pre-wrap"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSendEmail}
                                disabled={isSending}
                                className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-400"
                            >
                                <Mail size={18} className="mr-2" />
                                {isSending ? 'Sending...' : 'Send Email'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OutreachEmailModal;
