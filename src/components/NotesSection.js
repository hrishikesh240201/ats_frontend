// src/components/NotesSection.js
import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const NotesSection = ({ application, onNoteAdded }) => {
    const [newNote, setNewNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNoteSubmit = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setIsSubmitting(true);
        try {
            await axiosInstance.post('/notes/', {
                application: application.id,
                text: newNote,
            });
            setNewNote('');
            onNoteAdded(); // This will refresh the application list in the parent
        } catch (error) {
            console.error("Failed to add note", error);
            alert("Error: Could not add note.");
        }
        setIsSubmitting(false);
    };

    return (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">Internal Notes</h4>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {application.notes && application.notes.length > 0 ? (
                    application.notes.map(note => (
                        <div key={note.id} className="bg-gray-600 p-2 rounded">
                            <p className="text-sm text-gray-300">{note.text}</p>
                            <p className="text-xs text-gray-400 text-right mt-1">
                                - {note.author_name} on {new Date(note.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-400">No notes yet.</p>
                )}
            </div>
            <form onSubmit={handleNoteSubmit}>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="w-full p-2 border rounded h-20 bg-gray-600 text-white border-gray-500"
                    required
                ></textarea>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {isSubmitting ? 'Saving...' : 'Add Note'}
                </button>
            </form>
        </div>
    );
};

export default NotesSection;