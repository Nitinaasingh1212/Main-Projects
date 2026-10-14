import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { updateTaskStatus } from '../../firebase/firestoreService';

const KanbanBoard = ({ data }) => {
    const [, setUserData] = useContext(AuthContext);
    const [draggedTaskInfo, setDraggedTaskInfo] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);
    const [updatingIndex, setUpdatingIndex] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const employeeId = data?.docId || data?.id || data?.firstName;
    const tasks = data?.tasks || [];

    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const columns = [
        {
            id: 'new',
            title: 'To Do Tasks',
            actionName: 'new',
            icon: '📥',
            color: 'rose',
            accentBar: 'bg-rose-500',
            badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
            tasks: tasks
                .map((task, originalIndex) => ({ task, originalIndex }))
                .filter(({ task }) => task.newTask && !task.active && !task.completed && !task.failed)
        },
        {
            id: 'active',
            title: 'In Progress',
            actionName: 'accept',
            icon: '⚡',
            color: 'sky',
            accentBar: 'bg-[#0084ff]',
            badgeBg: 'bg-sky-50 text-[#0084ff] border-sky-200',
            tasks: tasks
                .map((task, originalIndex) => ({ task, originalIndex }))
                .filter(({ task }) => task.active && !task.completed && !task.failed)
        },
        {
            id: 'completed',
            title: 'Done',
            actionName: 'complete',
            icon: '✅',
            color: 'emerald',
            accentBar: 'bg-emerald-500',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            tasks: tasks
                .map((task, originalIndex) => ({ task, originalIndex }))
                .filter(({ task }) => task.completed)
        },
        {
            id: 'failed',
            title: 'Issues / Failed',
            actionName: 'fail',
            icon: '⚠️',
            color: 'amber',
            accentBar: 'bg-amber-500',
            badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
            tasks: tasks
                .map((task, originalIndex) => ({ task, originalIndex }))
                .filter(({ task }) => task.failed)
        }
    ];

    const handleDragStart = (e, originalIndex, fromColId, taskTitle) => {
        setDraggedTaskInfo({ originalIndex, fromColId, taskTitle });
        e.dataTransfer.setData('text/plain', JSON.stringify({ originalIndex, fromColId }));
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

    const handleDrop = async (e, targetColId) => {
        e.preventDefault();
        setDragOverColumn(null);

        let dragData = draggedTaskInfo;
        if (!dragData) {
            try {
                const raw = e.dataTransfer.getData('text/plain');
                if (raw) dragData = JSON.parse(raw);
            } catch (err) {
                return;
            }
        }

        if (!dragData || dragData.fromColId === targetColId) {
            setDraggedTaskInfo(null);
            return;
        }

        const { originalIndex, taskTitle } = dragData;
        setDraggedTaskInfo(null);
        await performStatusUpdate(originalIndex, targetColId, taskTitle);
    };

    const performStatusUpdate = async (originalIndex, newStatus, taskTitle = '') => {
        setUpdatingIndex(originalIndex);
        try {
            const res = await updateTaskStatus(employeeId, originalIndex, newStatus);
            if (res?.localData && setUserData) {
                setUserData(res.localData);
            }
            const statusNames = {
                new: 'To Do',
                active: 'In Progress',
                accept: 'In Progress',
                completed: 'Done',
                complete: 'Done',
                failed: 'Issues / Failed',
                fail: 'Issues / Failed'
            };
            showToast(`Task moved to "${statusNames[newStatus] || newStatus}"`);
        } catch (error) {
            console.error('Failed to update task:', error);
            showToast(`Error: ${error.message}`);
        } finally {
            setUpdatingIndex(null);
        }
    };

    return (
        <div className="mt-8 space-y-4">
            {/* Header & Instructions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Task Boards</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0084ff] border border-sky-200">
                            Interactive Kanban
                        </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                        Drag and drop cards or click quick-action buttons to progress workflow stages.
                    </p>
                </div>

                {toastMessage && (
                    <div className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg animate-bounce">
                        {toastMessage}
                    </div>
                )}
            </div>

            {/* 4 Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {columns.map((column) => {
                    const isDragOver = dragOverColumn === column.id;
                    return (
                        <div
                            key={column.id}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragLeave={(e) => handleDragLeave(e, column.id)}
                            onDrop={(e) => handleDrop(e, column.id)}
                            className={`rounded-2xl border transition-all flex flex-col bg-slate-50/70 p-4 min-h-[480px] ${
                                isDragOver
                                    ? 'border-[#0084ff] bg-sky-50/40 ring-2 ring-[#0084ff]/20'
                                    : 'border-slate-200/80 hover:border-slate-300'
                            }`}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-full ${column.accentBar}`}></div>
                                    <h4 className="text-xs font-bold text-slate-800">
                                        {column.title}
                                    </h4>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${column.badgeBg}`}>
                                    {column.tasks.length}
                                </span>
                            </div>

                            {/* Task Cards Container */}
                            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                                {column.tasks.map(({ task, originalIndex }) => {
                                    const isUpdating = updatingIndex === originalIndex;
                                    return (
                                        <div
                                            key={originalIndex}
                                            draggable={!isUpdating}
                                            onDragStart={(e) => handleDragStart(e, originalIndex, column.id, task.taskTitle)}
                                            className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative"
                                        >
                                            {/* Priority Badge & Category */}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                                    #{task.category || 'UI001'}
                                                </span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                    task.priority === 'Urgent'
                                                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                                        : task.priority === 'High'
                                                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                                                }`}>
                                                    {task.priority || 'Medium'}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors line-clamp-2">
                                                {task.taskTitle}
                                            </h5>

                                            {/* Description */}
                                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                {task.taskDescription}
                                            </p>

                                            {/* Google Meet Link if present */}
                                            {task.meetLink && (
                                                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                                                    <a
                                                        href={task.meetLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0084ff] hover:underline"
                                                    >
                                                        <span>🎥 Join Task Meet</span>
                                                    </a>
                                                </div>
                                            )}

                                            {/* Footer with Due Date & Action controls */}
                                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    📅 {task.taskDate}
                                                </span>

                                                {/* Quick Action Progression Buttons */}
                                                <div className="flex items-center gap-1">
                                                    {column.id === 'new' && (
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => performStatusUpdate(originalIndex, 'active', task.taskTitle)}
                                                            className="px-2 py-0.5 rounded bg-sky-50 text-[#0084ff] hover:bg-sky-100 font-semibold text-[10px] border border-sky-200"
                                                        >
                                                            Start →
                                                        </button>
                                                    )}
                                                    {column.id === 'active' && (
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => performStatusUpdate(originalIndex, 'completed', task.taskTitle)}
                                                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[10px] border border-emerald-200"
                                                        >
                                                            Complete ✓
                                                        </button>
                                                    )}
                                                    {column.id === 'completed' && (
                                                        <span className="text-emerald-600 font-bold text-[10px]">
                                                            Completed
                                                        </span>
                                                    )}
                                                    {column.id === 'failed' && (
                                                        <button
                                                            disabled={isUpdating}
                                                            onClick={() => performStatusUpdate(originalIndex, 'active', task.taskTitle)}
                                                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[10px] border border-amber-200"
                                                        >
                                                            Retry ↺
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {column.tasks.length === 0 && (
                                    <div className="h-32 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs font-medium">
                                        Drop tasks here
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;
