import React, { useState } from 'react';

const UserDashboardView = ({
    currentUser,
    tasks = [],
    onStatusChange,
    onTaskClick,
    onAddPersonalTask
}) => {
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    // Calculate user's personal statistics (Section 16)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED').length;
    const overdueTasks = tasks.filter(t => {
        if (t.status === 'COMPLETED') return false;
        return new Date(t.dueDate) < new Date();
    }).length;

    const progressPercentage = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

    // Columns for User Kanban
    const columns = [
        {
            id: 'TODO',
            title: 'To Do',
            icon: '📋',
            color: 'slate',
            accent: 'bg-slate-400',
            badgeBg: 'bg-slate-100 text-slate-700'
        },
        {
            id: 'IN_PROGRESS',
            title: 'In Progress',
            icon: '⚡',
            color: 'sky',
            accent: 'bg-[#0084ff]',
            badgeBg: 'bg-sky-50 text-[#0084ff]'
        },
        {
            id: 'COMPLETED',
            title: 'Completed',
            icon: '✅',
            color: 'emerald',
            accent: 'bg-emerald-500',
            badgeBg: 'bg-emerald-50 text-emerald-700'
        }
    ];

    // Drag handlers
    const handleDragStart = (e, taskId) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('text/plain', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverColumn !== colId) {
            setDragOverColumn(colId);
        }
    };

    const handleDragLeave = (e, colId) => {
        if (dragOverColumn === colId) {
            setDragOverColumn(null);
        }
    };

    const handleDrop = (e, targetColId) => {
        e.preventDefault();
        setDragOverColumn(null);
        const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== targetColId) {
            onStatusChange(taskId, targetColId);
        }
        setDraggedTaskId(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Prompt Section 16: User Welcome Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-[#0084ff] border border-sky-200 uppercase tracking-wider">
                            My Private Workspace
                        </span>
                        <span className="text-xs text-slate-400">• Team Member Portal</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome, {currentUser?.name?.split(' ')[0] || 'Member'} 👋
                    </h2>

                    <div className="flex items-center gap-3 pt-1 text-xs">
                        <span className="font-bold text-[#0084ff] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                            Position: {currentUser?.position || 'Frontend Developer'}
                        </span>
                        <span className="text-slate-400 font-medium">
                            {currentUser?.department} • Team: {currentUser?.team || 'General'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {onAddPersonalTask && (
                        <button
                            onClick={onAddPersonalTask}
                            className="px-4 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                        >
                            <span>+ Add Personal Task</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Prompt Section 16: Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Tasks</span>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2">{totalTasks}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Assigned deliverables</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">Completed</span>
                    <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">{completedTasks}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Approved & closed</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider block">Pending</span>
                    <h3 className="text-3xl font-extrabold text-sky-600 mt-2">{pendingTasks}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">To do & in progress</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
                    <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">Overdue</span>
                    <h3 className="text-3xl font-extrabold text-rose-600 mt-2">{overdueTasks}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">Needs urgent attention</p>
                </div>
            </div>

            {/* Prompt Section 16: Progress Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Overall Work Progress</h4>
                        <p className="text-xs text-slate-400">Completion rate of your assigned work items</p>
                    </div>
                    <span className="text-lg font-extrabold text-[#0084ff]">
                        {progressPercentage}%
                    </span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-[#0084ff] to-blue-500 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Prompt Section 10: DRAG AND DROP KANBAN BOARD (MY WORK) */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <span>MY WORK</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-[#0084ff] border border-sky-200">
                                Drag & Drop Interface
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                            Drag your cards across columns to advance workflow stages. Click card for checklist and comments.
                        </p>
                    </div>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {columns.map(column => {
                        const colTasks = tasks.filter(t => {
                            if (column.id === 'IN_PROGRESS') {
                                return t.status === 'IN_PROGRESS' || t.status === 'REWORK';
                            }
                            return t.status === column.id;
                        });
                        const isDragTarget = dragOverColumn === column.id;

                        return (
                            <div
                                key={column.id}
                                onDragOver={(e) => handleDragOver(e, column.id)}
                                onDragLeave={(e) => handleDragLeave(e, column.id)}
                                onDrop={(e) => handleDrop(e, column.id)}
                                className={`rounded-2xl border transition-all flex flex-col bg-slate-50/70 p-3.5 min-h-[500px] ${
                                    isDragTarget
                                        ? 'border-[#0084ff] bg-sky-50/50 ring-2 ring-[#0084ff]/20'
                                        : 'border-slate-200/80 hover:border-slate-300'
                                }`}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${column.accent}`}></div>
                                        <h4 className="text-xs font-bold text-slate-800">
                                            {column.title}
                                        </h4>
                                    </div>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${column.badgeBg}`}>
                                        {colTasks.length}
                                    </span>
                                </div>

                                {/* Tasks Stack */}
                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {colTasks.map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task.id)}
                                            onClick={() => onTaskClick && onTaskClick(task)}
                                            className={`bg-white rounded-xl p-3.5 border transition-all shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing group ${
                                                task.status === 'REWORK'
                                                    ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200'
                                                    : 'border-slate-200 hover:border-[#0084ff]'
                                            }`}
                                        >
                                            {/* Priority & Category */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                                    #{task.category}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {task.status === 'REWORK' && (
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                                                            REWORK
                                                        </span>
                                                    )}
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        task.priority === 'Urgent'
                                                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            : task.priority === 'High'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors line-clamp-2">
                                                {task.title}
                                            </h5>

                                            {/* Description preview */}
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                {task.description}
                                            </p>

                                            {/* Rework alert if any */}
                                            {task.status === 'REWORK' && task.reviewFeedback && (
                                                <div className="mt-2 p-1.5 rounded bg-rose-50 text-[10px] text-rose-700 font-medium">
                                                    ⚠️ Feedback: {task.reviewFeedback}
                                                </div>
                                            )}

                                            {/* Card Footer */}
                                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                <span>📅 {task.dueDate}</span>
                                                {task.checklist && task.checklist.length > 0 && (
                                                    <span className="text-[10px] font-semibold text-slate-600">
                                                        ✓ {task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {colTasks.length === 0 && (
                                        <div className="h-32 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs font-medium">
                                            Drop your work here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserDashboardView;
