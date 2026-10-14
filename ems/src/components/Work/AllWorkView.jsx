import React, { useState } from 'react';

const AllWorkView = ({
    tasks = [],
    users = [],
    currentUser,
    onStatusChange,
    onTaskClick,
    onAddNewTask
}) => {
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');
    const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('ALL');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dragOverColumn, setDragOverColumn] = useState(null);

    const isAdmin = currentUser?.role === 'main_admin' || currentUser?.role === 'secondary_admin';

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = (
            task.title?.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.category?.toLowerCase().includes(query) ||
            task.assignedToName?.toLowerCase().includes(query)
        );

        const matchesUser = selectedUserFilter === 'ALL' || task.assignedToId === selectedUserFilter;
        const matchesPriority = selectedPriorityFilter === 'ALL' || task.priority === selectedPriorityFilter;
        const matchesDept = selectedDeptFilter === 'ALL' || task.assignedToDepartment === selectedDeptFilter;

        return matchesSearch && matchesUser && matchesPriority && matchesDept;
    });

    const columns = [
        {
            id: 'TODO',
            title: 'To Do',
            icon: '📋',
            color: 'slate',
            border: 'border-slate-200',
            headerBg: 'bg-slate-100 text-slate-700',
            dot: 'bg-slate-400'
        },
        {
            id: 'IN_PROGRESS',
            title: 'In Progress',
            icon: '⚡',
            color: 'sky',
            border: 'border-sky-200',
            headerBg: 'bg-sky-50 text-[#0084ff]',
            dot: 'bg-[#0084ff]'
        },
        {
            id: 'COMPLETED',
            title: 'Completed',
            icon: '✅',
            color: 'emerald',
            border: 'border-emerald-200',
            headerBg: 'bg-emerald-50 text-emerald-700',
            dot: 'bg-emerald-500'
        }
    ];

    // Drag and Drop handlers
    const handleDragStart = (e, taskId) => {
        // Enforce privacy/ownership on drag:
        const task = tasks.find(t => t.id === taskId);
        if (currentUser.role === 'user' && task.assignedToId !== currentUser.id) {
            e.preventDefault();
            return;
        }

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
            // User can only drag their own tasks
            if (currentUser.role === 'user' && task.assignedToId !== currentUser.id) {
                return;
            }
            onStatusChange(taskId, targetColId);
        }
        setDraggedTaskId(null);
    };

    const departmentsList = Array.from(new Set(users.map(u => u.department).filter(Boolean)));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>{isAdmin ? "Central Work Management" : "My Work Board"}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0084ff] border border-sky-200">
                            {filteredTasks.length} Work Items
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {isAdmin 
                            ? "Complete overview of team assignments, progression stages, and review workflows."
                            : "Manage your assigned deliverables with interactive drag-and-drop."}
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {/* View Switcher */}
                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                viewMode === 'kanban' 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            📊 Kanban Board
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                viewMode === 'table' 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            📋 Table List
                        </button>
                    </div>

                    {onAddNewTask && (
                        <button
                            onClick={onAddNewTask}
                            className="px-4 py-2 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                        >
                            <span>+ {isAdmin ? "Assign Work" : "Add Personal Task"}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center flex-wrap gap-3 flex-1 min-w-[280px]">
                    {/* Search */}
                    <div className="relative w-64">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tasks, categories..."
                            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Filter User (Admin only) */}
                    {isAdmin && (
                        <select
                            value={selectedUserFilter}
                            onChange={(e) => setSelectedUserFilter(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white cursor-pointer"
                        >
                            <option value="ALL">All Team Members ({users.length})</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.position})
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Filter Priority */}
                    <select
                        value={selectedPriorityFilter}
                        onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white cursor-pointer"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="Urgent">🔥 Urgent</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                    </select>

                    {/* Filter Department */}
                    {isAdmin && (
                        <select
                            value={selectedDeptFilter}
                            onChange={(e) => setSelectedDeptFilter(e.target.value)}
                            className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white cursor-pointer"
                        >
                            <option value="ALL">All Departments</option>
                            {departmentsList.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>Showing {filteredTasks.length} of {tasks.length}</span>
                </div>
            </div>

            {/* Empty State Banner when 0 tasks in workspace */}
            {tasks.length === 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-[#0084ff] flex items-center justify-center text-2xl mx-auto mb-3 border border-sky-100">
                        📋
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                        Work Board is Clean from Scratch!
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                        Zero deliverables scheduled yet. Click "+ Assign New Work" to create deliverables, checklists, and assign members.
                    </p>
                    <button
                        onClick={onAddNewTask}
                        className="px-4 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm inline-flex items-center gap-1.5"
                    >
                        <span>+ Assign First Work Item</span>
                    </button>
                </div>
            )}

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {columns.map(column => {
                        const colTasks = filteredTasks.filter(t => {
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
                                className={`rounded-2xl border transition-all flex flex-col bg-slate-50/80 p-3.5 min-h-[560px] ${
                                    isDragTarget
                                        ? 'border-[#0084ff] bg-sky-50/60 ring-2 ring-[#0084ff]/20'
                                        : 'border-slate-200/80 hover:border-slate-300'
                                }`}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`}></div>
                                        <h4 className="text-xs font-bold text-slate-800">
                                            {column.title}
                                        </h4>
                                    </div>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${column.headerBg}`}>
                                        {colTasks.length}
                                    </span>
                                </div>

                                {/* Task Cards Stack */}
                                <div className="space-y-3 flex-1 overflow-y-auto">
                                    {colTasks.map(task => {
                                        const isMyTask = task.assignedToId === currentUser.id;
                                        const canDrag = isAdmin || isMyTask;

                                        return (
                                            <div
                                                key={task.id}
                                                draggable={canDrag}
                                                onDragStart={(e) => handleDragStart(e, task.id)}
                                                onClick={() => onTaskClick && onTaskClick(task)}
                                                className={`bg-white rounded-xl p-3.5 border transition-all shadow-sm hover:shadow-md cursor-pointer group relative ${
                                                    task.status === 'REWORK' 
                                                        ? 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-200' 
                                                        : 'border-slate-200 hover:border-[#0084ff]'
                                                } ${canDrag ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                            >
                                                {/* Top Badges */}
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
                                                <h5 className="text-xs font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors line-clamp-2 leading-snug">
                                                    {task.title}
                                                </h5>

                                                {/* Description preview */}
                                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                                                    {task.description}
                                                </p>

                                                {/* Attachments Indicator */}
                                                {task.attachments && task.attachments.length > 0 && (
                                                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-1">
                                                            <span>📎</span>
                                                            <span>{task.attachments.length}</span>
                                                        </span>
                                                        {task.attachments.some(a => a.category === 'video' || a.mimeType?.startsWith('video/') || a.name?.endsWith('.mp4') || a.name?.endsWith('.webm') || a.name?.endsWith('.mov')) && (
                                                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-0.5">
                                                                <span>🎬</span>
                                                                <span>Video</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Member / Assignee badge (Admin view) */}
                                                {isAdmin && (
                                                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <div className="w-5 h-5 rounded-full bg-sky-100 text-[#0084ff] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                                                {task.assignedToName?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="font-semibold text-slate-700 truncate">
                                                                {task.assignedToName}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                                                            {task.dueDate}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* User view footer */}
                                                {!isAdmin && (
                                                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                        <span>Due: <strong className="text-slate-700">{task.dueDate}</strong></span>
                                                        {task.checklist && task.checklist.length > 0 && (
                                                            <span className="text-[10px] text-slate-500 font-semibold">
                                                                ✓ {task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Quick Complete button on card for Admin if task is active */}
                                                {isAdmin && task.status !== 'COMPLETED' && (
                                                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onStatusChange(task.id, 'COMPLETED', 'Marked completed by Admin');
                                                            }}
                                                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold transition-colors"
                                                        >
                                                            ✓ Mark Done
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {colTasks.length === 0 && (
                                        <div className="h-36 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-xs font-medium">
                                            Drop work items here
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/70">
                                    <th className="py-3 px-4">Task Name</th>
                                    {isAdmin && <th className="py-3 px-4">Assigned Member</th>}
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Priority</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Due Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {filteredTasks.map(task => (
                                    <tr 
                                        key={task.id} 
                                        onClick={() => onTaskClick && onTaskClick(task)}
                                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                    >
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors">{task.title}</span>
                                                {task.attachments && task.attachments.length > 0 && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex items-center gap-0.5">
                                                        <span>📎</span>
                                                        <span>{task.attachments.length}</span>
                                                    </span>
                                                )}
                                                {task.attachments?.some(a => a.category === 'video' || a.mimeType?.startsWith('video/') || a.name?.endsWith('.mp4') || a.name?.endsWith('.webm') || a.name?.endsWith('.mov')) && (
                                                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                                                        🎬 Video
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-400 line-clamp-1">{task.description}</div>
                                        </td>
                                        {isAdmin && (
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-800">{task.assignedToName}</div>
                                                <div className="text-[10px] text-slate-400">{task.assignedToPosition}</div>
                                            </td>
                                        )}
                                        <td className="py-3.5 px-4">
                                            <span className="font-mono text-slate-600">#{task.category}</span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                task.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                                task.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="text-slate-700 font-semibold">{task.dueDate}</span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTaskClick(task);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-sky-50 text-[#0084ff] border border-sky-200 hover:bg-sky-100 font-semibold text-[11px] transition-colors"
                                            >
                                                Inspect
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllWorkView;
