// src/components/TaskManager.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { CheckCircle, AlertTriangle, Clock, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Calendar from 'react-calendar';
import '../Calendar.css'; // Ensure you have this CSS file

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState(null); // State for the new task's due date

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleUpdateTask = async (taskId, data) => {
        try {
            await axiosInstance.patch(`/tasks/${taskId}/`, data);
            toast.success("Task updated!");
            fetchTasks();
            setEditingTask(null);
        } catch (error) {
            console.error("Failed to update task", error);
            toast.error("Could not update the task.");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        
        const payload = { title: newTaskTitle };
        if (newDueDate) {
            payload.due_date = newDueDate.toISOString().split('T')[0];
        }

        try {
            await axiosInstance.post('/tasks/', payload);
            toast.success("New task added!");
            setNewTaskTitle('');
            setNewDueDate(null);
            setIsFormOpen(false);
            fetchTasks();
        } catch (error) {
            toast.error("Failed to add task.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axiosInstance.delete(`/tasks/${taskId}/`);
                toast.success("Task deleted.");
                fetchTasks();
            } catch (error) {
                toast.error("Failed to delete task.");
            }
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return <AlertTriangle className="text-red-400" size={20} />;
            case 'medium': return <AlertTriangle className="text-yellow-400" size={20} />;
            case 'low': return <Clock className="text-blue-400" size={20} />;
            default: return null;
        }
    };

    const tileClassName = ({ date, view }) => {
        // Add a class to days that have a due task
        if (view === 'month') {
            const hasTask = tasks.some(
                task => !task.is_completed && task.due_date && new Date(task.due_date).toDateString() === date.toDateString()
            );
            if (hasTask) {
                return 'day-with-task';
            }
        }
        return null;
    };

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Task Manager</h2>
                <button onClick={() => setIsFormOpen(!isFormOpen)} className="text-blue-400 hover:underline flex items-center text-sm">
                    <Plus size={16} className="mr-1" /> Add Task
                </button>
            </div>
            
            {isFormOpen && (
                <form onSubmit={handleCreateTask} className="mb-4 p-3 bg-gray-800 rounded space-y-3">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New task title..."
                        className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600"
                    />
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Set Due Date (Optional)</label>
                        <Calendar onChange={setNewDueDate} value={newDueDate} />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Add</button>
                </form>
            )}

            <div className="mb-4">
                <Calendar tileClassName={tileClassName} />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {tasks.filter(t => !t.is_completed).length > 0 ? (
                    tasks.filter(t => !t.is_completed).map(task => (
                        <div key={task.id} className="p-3 bg-gray-800 rounded">
                            <div className="flex items-start">
                                <div className="mr-3 mt-1">{getPriorityIcon(task.priority)}</div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-white">{task.title}</p>
                                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                                        <CalendarIcon size={14} className="mr-1" />
                                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date set'}
                                        <button onClick={() => setEditingTask(task.id === editingTask ? null : task.id)} className="ml-2 text-blue-400 hover:underline text-xs">(edit)</button>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleUpdateTask(task.id, { is_completed: true })}
                                        title="Mark as Complete"
                                        className="p-2 text-green-400 hover:text-white hover:bg-green-500 rounded-full transition-colors"
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        title="Delete Task"
                                        className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-full transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                            {editingTask === task.id && (
                                <div className="mt-2 p-2 bg-gray-700 rounded">
                                     <Calendar 
                                        onChange={(date) => handleUpdateTask(task.id, { due_date: date.toISOString().split('T')[0] })}
                                        value={task.due_date ? new Date(task.due_date) : null}
                                     />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center py-4">No pending tasks. Great job!</p>
                )}
            </div>
        </div>
    );
};

export default TaskManager;