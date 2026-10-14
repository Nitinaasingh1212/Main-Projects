import React from 'react';

const UserWorkModal = ({ user, tasks = [], onClose, onAssignTask, onTaskClick }) => {
    if (!user) return null;

    const userTasks = tasks.filter(t => t.assignedToId === user.id);
    const completedTasks = userTasks.filter(t => t.status === 'COMPLETED');
    const pendingTasks = userTasks.filter(t => t.status !== 'COMPLETED');
    const overdueTasks = userTasks.filter(t => {
        if (t.status === 'COMPLETED') return false;
        return new Date(t.dueDate) < new Date();
    });

    const completionRate = userTasks.length > 0 
        ? Math.round((completedTasks.length / userTasks.length) * 100) 
        : 0;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'TODO':
                return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">TODO</span>;
            case 'IN_PROGRESS':
                return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">IN PROGRESS</span>;
            case 'COMPLETED':
                return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">COMPLETED</span>;
            case 'REWORK':
                return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">REWORK NEEDED</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'Urgent':
                return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">🔥 Urgent</span>;
            case 'High':
                return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">High</span>;
            case 'Medium':
                return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Medium</span>;
            default:
                return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">Low</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-sky-500/20">
                            {user.avatar || user.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                    user.status === 'Active' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {user.status || 'Active'}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-[#0084ff] mt-0.5">{user.position}</p>
                            <p className="text-[11px] text-slate-400">
                                {user.department} • Team: {user.team || 'General'} • ID: {user.employeeId || 'N/A'} • {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onAssignTask && (
                            <button
                                onClick={() => onAssignTask(user)}
                                className="px-4 py-2 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                            >
                                <span>+ Assign Work</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 border-b border-slate-100 bg-white">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Work</span>
                        <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{userTasks.length} Tasks</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                        <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">Completed</span>
                        <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{completedTasks.length}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/70">
                        <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider block">Pending</span>
                        <span className="text-2xl font-extrabold text-sky-700 mt-1 block">{pendingTasks.length}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70">
                        <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">Overdue</span>
                        <span className="text-2xl font-extrabold text-rose-700 mt-1 block">{overdueTasks.length}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Completion Progress:</span>
                    <div className="flex items-center gap-3 w-1/2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-[#0084ff] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${completionRate}%` }}
                            ></div>
                        </div>
                        <span className="font-bold text-[#0084ff] min-w-[36px]">{completionRate}%</span>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="p-6 overflow-y-auto flex-1 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Assigned Work Items ({userTasks.length})
                    </h4>

                    {userTasks.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <span className="text-3xl block mb-2">📁</span>
                            <p className="text-xs font-semibold text-slate-600">No work assigned yet to {user.name}.</p>
                            <p className="text-[11px] text-slate-400 mt-1">Click "+ Assign Work" to allocate tasks to this team member.</p>
                        </div>
                    ) : (
                        userTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => onTaskClick && onTaskClick(task)}
                                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#0084ff] hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                                            #{task.category}
                                        </span>
                                        {getPriorityBadge(task.priority)}
                                        {getStatusBadge(task.status)}
                                    </div>
                                    <h5 className="text-sm font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors">
                                        {task.title}
                                    </h5>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {task.description}
                                    </p>
                                </div>

                                <div className="text-right sm:border-l border-slate-100 sm:pl-4 flex-shrink-0 flex sm:flex-col justify-between items-center sm:items-end">
                                    <span className="text-[11px] text-slate-400 block">
                                        Due: <strong className="text-slate-700">{task.dueDate}</strong>
                                    </span>
                                    {task.checklist && task.checklist.length > 0 && (
                                        <span className="text-[10px] text-slate-500 font-medium mt-1">
                                            ✓ {task.checklist.filter(c => c.completed).length}/{task.checklist.length} checklist
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserWorkModal;
