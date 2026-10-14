import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { addTaskToEmployee } from '../../firebase/firestoreService';

const CreateTask = ({ defaultAssignee = '', onTaskCreated }) => {
    const [userData, setUserData] = useContext(AuthContext) || [[]];

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
    const [asignTo, setAsignTo] = useState(defaultAssignee);
    const [category, setCategory] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    React.useEffect(() => {
        if (defaultAssignee) {
            setAsignTo(defaultAssignee);
        }
    }, [defaultAssignee]);

    const generateTaskMeetLink = () => {
        const randStr = (len) => Math.random().toString(36).substring(2, 2 + len);
        const code = `xyz-${randStr(3)}-${randStr(3)}`;
        setMeetLink(`https://meet.google.com/${code}`);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!asignTo.trim()) {
            alert("Please specify which employee to assign the task to.");
            return;
        }

        setLoading(true);
        setStatusMessage(null);

        const taskData = {
            taskTitle,
            taskDescription,
            taskDate,
            category: category || 'General',
            priority,
            meetLink: meetLink.trim() || undefined
        };

        try {
            const result = await addTaskToEmployee(asignTo, taskData);

            if (result?.localData && setUserData) {
                setUserData(result.localData);
            }

            setStatusMessage({
                type: 'success',
                text: `Task successfully assigned to ${asignTo}!`
            });

            setTaskTitle('');
            setCategory('');
            setAsignTo('');
            setTaskDate(new Date().toISOString().split('T')[0]);
            setTaskDescription('');
            setMeetLink('');

            if (onTaskCreated) onTaskCreated();
        } catch (error) {
            console.error("Error creating task:", error);
            setStatusMessage({
                type: 'error',
                text: error.message || 'Failed to create task.'
            });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setStatusMessage(null);
            }, 4000);
        }
    };

    return (
        <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <span>📋 Create & Assign Task</span>
                    </h3>
                    <p className="text-xs text-slate-400">Direct assignment with optional Google Meet link</p>
                </div>
            </div>

            {statusMessage && (
                <div className={`p-3 mb-4 rounded-xl text-xs font-semibold ${statusMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3.5">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Task Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                            required
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400"
                            type="text"
                            placeholder="e.g. Implement Multi-Tenant Organization Flow"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Due Date <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                value={taskDate}
                                onChange={(e) => setTaskDate(e.target.value)}
                                className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800"
                                type="date"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                            >
                                <option value="Low">🟢 Low</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="High">🔴 High</option>
                                <option value="Urgent">🔥 Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Assign to <span className="text-rose-500">*</span>
                            </label>
                            {userData && userData.length > 0 ? (
                                <select
                                    required
                                    value={asignTo}
                                    onChange={(e) => setAsignTo(e.target.value)}
                                    className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                                >
                                    <option value="">Select Employee</option>
                                    {userData.map((emp, idx) => (
                                        <option key={idx} value={emp.firstName}>
                                            {emp.firstName} ({emp.company || 'Enterprise'})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    required
                                    value={asignTo}
                                    onChange={(e) => setAsignTo(e.target.value)}
                                    className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800"
                                    type="text"
                                    placeholder="Employee name"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
                            <input
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400"
                                type="text"
                                placeholder="Design, Engineering, QA..."
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-slate-600">Attach Google Meet (Optional)</label>
                            <button
                                type="button"
                                onClick={generateTaskMeetLink}
                                className="text-[11px] text-[#0084ff] hover:underline"
                            >
                                Generate Link
                            </button>
                        </div>
                        <input
                            type="url"
                            value={meetLink}
                            onChange={(e) => setMeetLink(e.target.value)}
                            placeholder="https://meet.google.com/xxx-yyyy-zzz"
                            className="text-xs py-2 px-3 w-full rounded-lg border border-slate-200 font-mono text-slate-700 bg-slate-50 outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Description <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 resize-none"
                            placeholder="Enter detailed requirements, objectives, deliverable links..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#0084ff] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm mt-3"
                    >
                        {loading ? 'Assigning Task...' : '🚀 Create & Assign Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;