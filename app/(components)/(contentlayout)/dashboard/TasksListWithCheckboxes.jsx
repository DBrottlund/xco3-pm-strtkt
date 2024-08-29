import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';

const TaskListWithCheckboxes = ({ tasks: initialTasks, setTasks: setUpdatedTasks, requestId }) => {
    const [tasks, setTasks] = useState(initialTasks);
    const [checkedTasks, setCheckedTasks] = useState({});
    const [newTitle, setNewTitle] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        setTasks(initialTasks);
    }, []);

    useEffect(() => {
        setUpdatedTasks(tasks);
    }, [tasks, setUpdatedTasks]);

    const handleCheckboxChange = (taskId) => {
        setCheckedTasks(prevState => {
            const newState = {
                ...prevState,
                [taskId]: !prevState[taskId]
            };
            return newState;
        });

        setTasks(prevTasks => prevTasks.map(task =>
            task.id === taskId
                ? { ...task, completedAt: !checkedTasks[taskId] ? new Date().toISOString() : null }
                : task
        ));
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTitle.trim() && newTaskText.trim()) {
            const newTask = {
                id: Date.now().toString(),
                title: newTitle.trim(),
                taskText: newTaskText.trim(),
                completedAt: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                requestId: requestId
            };
            setTasks(prevTasks => [...prevTasks, newTask]);
            setNewTitle('');
            setNewTaskText('');
            setShowForm(false);
        }
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setCheckedTasks(prevState => {
            const { [taskId]: _, ...rest } = prevState;
            return rest;
        });
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleUpdateTask = (e) => {
        e.preventDefault();
        setTasks(prevTasks => prevTasks.map(task =>
            task.id === editingTask.id
                ? { ...editingTask, updatedAt: new Date().toISOString() }
                : task
        ));
        setEditingTask(null);
    };

    return (
        <div className="space-y-6 bg-white rounded-md shadow-md p-6">
            <ol className="space-y-4 list-decimal list-inside">
                {tasks.map((task, index) => (
                    <li key={task.id} className="flex flex-col items-start">
                        {editingTask && editingTask.id === task.id ? (
                            <form onSubmit={handleUpdateTask} className="w-full space-y-2">
                                <input
                                    type="text"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                                <input
                                    type="text"
                                    value={editingTask.taskText}
                                    onChange={(e) => setEditingTask({...editingTask, taskText: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                                <div className="flex space-x-2">
                                    <button type="submit" className="flex-1 bg-green-500 text-white py-1 rounded hover:bg-green-600">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setEditingTask(null)} className="flex-1 bg-gray-300 text-gray-700 py-1 rounded hover:bg-gray-400">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center space-x-2 w-full">
                                    <span>{index + 1}.</span>
                                    <input
                                        type="checkbox"
                                        id={`task-${task.id}`}
                                        checked={!!task.completedAt}
                                        onChange={() => handleCheckboxChange(task.id)}
                                        className="mt-1"
                                    />
                                    <label htmlFor={`task-${task.id}`} className="flex-1 font-bold">
                                        {task.title}
                                    </label>
                                    <button onClick={() => handleEditTask(task)}
                                            className="text-blue-500 hover:text-blue-700">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <span className="h-4 w-4">Remove</span>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-2 ml-12">{task.taskText}</p>
                            </>
                        )}
                    </li>
                ))}
            </ol>
            {showForm && (
                <form onSubmit={handleAddTask} className="space-y-4">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Enter task title"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Enter task description"
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex space-x-2">
                        <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600">
                            Add Task
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            {!showForm && (
                <button onClick={() => setShowForm(true)}
                        className="w-1/3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    <PlusCircle className="inline mr-2 h-4 w-4" /> Add Task
                </button>
            )}
        </div>
    );
};

export default TaskListWithCheckboxes;