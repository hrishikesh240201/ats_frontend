// src/components/ManageAutomation.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { SlidersHorizontal, Trash2, Power } from 'lucide-react';

const ManageAutomation = () => {
    const [rules, setRules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newRuleText, setNewRuleText] = useState(''); // State for the text command
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRules = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/automation-rules/');
            setRules(response.data);
        } catch (error) {
            console.error("Failed to fetch rules", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleCreateRule = async (e) => {
        e.preventDefault();
        if (!newRuleText.trim()) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.post('/automation-rules/create-from-text/', {
                text_command: newRuleText,
            });
            toast.success("New automation rule created!");
            setNewRuleText('');
            fetchRules(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create rule.");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (ruleId) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            try {
                await axiosInstance.delete(`/automation-rules/${ruleId}/`);
                toast.success("Rule deleted successfully.");
                fetchRules();
            } catch (error) {
                toast.error("Failed to delete rule.");
            }
        }
    };

    const handleToggleActive = async (rule) => {
        try {
            await axiosInstance.patch(`/automation-rules/${rule.id}/`, { is_active: !rule.is_active });
            toast.success(`Rule "${rule.name}" ${!rule.is_active ? 'activated' : 'deactivated'}.`);
            fetchRules();
        } catch (error) {
            toast.error("Failed to update rule status.");
        }
    };

    if (isLoading) {
        return <div>Loading automation rules...</div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold flex items-center mb-6"><SlidersHorizontal className="mr-3" /> Automation Rules</h2>

            {/* --- NEW: Natural Language Input Form --- */}
            <div className="mb-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <form onSubmit={handleCreateRule}>
                    <label className="block mb-2 text-lg font-semibold text-white">Create a New Rule</label>
                    <p className="text-sm text-gray-400 mb-3">Describe the rule you want to create in plain English. For example: "Auto-reject candidates with a score below 25%"</p>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={newRuleText}
                            onChange={(e) => setNewRuleText(e.target.value)}
                            placeholder="Enter your command..."
                            className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-400"
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Rules List */}
            <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 space-y-3">
                <h3 className="text-xl font-semibold mb-2">Your Active Rules</h3>
                {rules.length > 0 ? (
                    rules.map(rule => (
                        <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                            <div>
                                <p className="font-semibold text-white">{rule.name}</p>
                                <p className="text-sm text-gray-400">
                                    IF ATS score is below {rule.ats_threshold}%, THEN change status to Rejected.
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => handleToggleActive(rule)}
                                    title={rule.is_active ? "Deactivate Rule" : "Activate Rule"}
                                    className={`p-2 rounded-full ${rule.is_active ? 'text-green-400 hover:bg-green-500' : 'text-gray-500 hover:bg-gray-600'}`}
                                >
                                    <Power size={20} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(rule.id)}
                                    title="Delete Rule" 
                                    className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-full"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No automation rules created yet.</p>
                )}
            </div>
        </div>
    );
};

export default ManageAutomation;