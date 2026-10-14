import React, { useState } from 'react';
import UserWorkModal from '../Users/UserWorkModal';

const AdminDashboardView = ({
    currentUser,
    users = [],
    secondaryAdmins = [],
    tasks = [],
    onNavigate,
    onAssignTask,
    onTaskClick,
    onSwitchPreset,
    onResetToScratch
}) => {
    const [selectedUserForModal, setSelectedUserForModal] = useState(null);

    // Calculate Admin Dashboard Metrics per Section 11
    const totalUsersCount = users.length;
    const activeUsersCount = users.filter(u => u.status === 'Active').length;

    const completedTasksCount = tasks.filter(t => t.status === 'COMPLETED').length;
    const pendingTasksCount = tasks.filter(t => t.status !== 'COMPLETED').length;
    const overdueTasksCount = tasks.filter(t => {
        if (t.status === 'COMPLETED') return false;
        return new Date(t.dueDate) < new Date();
    }).length;

    const overallProgress = tasks.length > 0 
        ? Math.round((completedTasksCount / tasks.length) * 100) 
        : 0;

    // Workflow stages
    const stageCounts = {
        TODO: tasks.filter(t => t.status === 'TODO').length,
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REWORK' || t.status === 'SUBMITTED' || t.status === 'REVIEW').length,
        COMPLETED: completedTasksCount
    };

    // Calculate user progress cards
    const userProgressList = users.map(user => {
        const userTasks = tasks.filter(t => t.assignedToId === user.id);
        const userCompleted = userTasks.filter(t => t.status === 'COMPLETED').length;
        const progressPct = userTasks.length > 0 ? Math.round((userCompleted / userTasks.length) * 100) : 0;
        return {
            ...user,
            userTasksCount: userTasks.length,
            userCompletedCount: userCompleted,
            progressPct
        };
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Top Greeting Banner with Preset Template Switcher */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-[#0084ff] border border-sky-200 uppercase tracking-wider">
                            {currentUser?.role === 'main_admin' ? 'Main Admin Hub' : 'Secondary Admin Console'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                            🏢 {currentUser?.organizationName || 'TeamWork HQ'}
                        </span>
                        <span className="text-xs text-slate-400">• Team Leadership System</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome, {currentUser?.name || 'Admin'} 👋
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                        Central management console for assigning deliverables, reviewing team progress, and governing team roles.
                    </p>
                </div>

                {/* Preset Switcher & Scratch Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex-shrink-0">
                    <button
                        onClick={() => onSwitchPreset && onSwitchPreset('university')}
                        className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-[#0084ff] text-xs font-bold transition-all text-left sm:text-center"
                    >
                        🎓 University
                    </button>
                    <button
                        onClick={() => onSwitchPreset && onSwitchPreset('hackathon')}
                        className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-bold transition-all text-left sm:text-center"
                    >
                        🚀 Hackathon
                    </button>
                    {currentUser?.role === 'main_admin' && onResetToScratch && (
                        <button
                            onClick={onResetToScratch}
                            title="Clear all tasks and members to build from scratch"
                            className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all text-left sm:text-center flex items-center justify-center gap-1"
                        >
                            <span>🧹 Scratch</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Prompt Section 11: 5 Core Admin Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Total Users */}
                <div 
                    onClick={() => onNavigate && onNavigate('users')}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Total Users</span>
                        <span className="text-sm">👥</span>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-[#0084ff] transition-colors">
                            {totalUsersCount}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Enrolled members</p>
                    </div>
                </div>

                {/* Active Users */}
                <div 
                    onClick={() => onNavigate && onNavigate('users')}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Active Users</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-3xl font-extrabold text-emerald-600">
                            {activeUsersCount}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Currently active</p>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div 
                    onClick={() => onNavigate && onNavigate('tasks')}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
                        <span className="text-sm">⏳</span>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-3xl font-extrabold text-sky-600">
                            {pendingTasksCount}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">In progress / review</p>
                    </div>
                </div>

                {/* Completed */}
                <div 
                    onClick={() => onNavigate && onNavigate('tasks')}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Completed</span>
                        <span className="text-sm">✅</span>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-3xl font-extrabold text-emerald-700">
                            {completedTasksCount}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Verified & done</p>
                    </div>
                </div>

                {/* Overdue */}
                <div 
                    onClick={() => onNavigate && onNavigate('tasks')}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-rose-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-rose-500">Overdue</span>
                        <span className="text-sm">⚠️</span>
                    </div>
                    <div className="mt-3">
                        <h3 className="text-3xl font-extrabold text-rose-600">
                            {overdueTasksCount}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Past deadline</p>
                    </div>
                </div>
            </div>

            {/* Workflow Pipeline Progress Bar */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">
                            Team Workflow Pipeline (TODO → IN PROGRESS → COMPLETED)
                        </h4>
                        <p className="text-xs text-slate-400">
                            Real-time progression distribution across core work statuses.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-[#0084ff]">
                        Overall Completion: {overallProgress}%
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">1. To Do</span>
                        <span className="text-sm font-extrabold text-slate-800">{stageCounts.TODO}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0084ff]">2. In Progress</span>
                        <span className="text-sm font-extrabold text-[#0084ff]">{stageCounts.IN_PROGRESS}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-700">3. Completed</span>
                        <span className="text-sm font-extrabold text-emerald-700">{stageCounts.COMPLETED}</span>
                    </div>
                </div>
            </div>

            {/* Prompt Section 11: USERS SECTION (Team Member Progress & Workload) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            Team Members & Individual Workload
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Click any team member card to view their complete assigned work, status breakdown, and deliverables.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onNavigate && onNavigate('users')}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                            View All {users.length} Users →
                        </button>
                    </div>
                </div>

                {/* Users List with Progress Bars matching Section 11 */}
                <div className="divide-y divide-slate-100">
                    {userProgressList.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-3 border border-amber-200">
                                🌱
                            </div>
                            <h4 className="text-base font-extrabold text-slate-900">
                                Fresh Workspace from Scratch!
                            </h4>
                            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                                No team members enrolled yet. You can enroll colleagues manually or share your organization name <strong>"{currentUser?.organizationName || 'Your Organization'}"</strong> for them to register themselves.
                            </p>
                            <button
                                onClick={() => onNavigate && onNavigate('users')}
                                className="px-4 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm inline-flex items-center gap-1.5"
                            >
                                <span>+ Add First Team Member</span>
                            </button>
                        </div>
                    ) : (
                        userProgressList.map(member => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedUserForModal(member)}
                                className="p-5 hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                {/* Member info */}
                                <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                                        {member.avatar || member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0084ff] transition-colors">
                                            {member.name}
                                        </h4>
                                        <p className="text-xs font-semibold text-[#0084ff]">
                                            {member.position}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            {member.department} • Team: {member.team || 'Core'} • ID: {member.employeeId}
                                        </p>
                                    </div>
                                </div>

                                {/* Prompt requirement format: "8 Tasks | 5 Completed" */}
                                <div className="flex items-center gap-6 sm:text-right">
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">
                                            {member.userTasksCount} Tasks | {member.userCompletedCount} Completed
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            {member.userTasksCount - member.userCompletedCount} pending deliverables
                                        </span>
                                    </div>

                                    {/* Visual Progress Bar */}
                                    <div className="w-32">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                                            <span>Progress</span>
                                            <span className="text-[#0084ff]">{member.progressPct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-[#0084ff] h-full rounded-full transition-all duration-300"
                                                style={{ width: `${member.progressPct}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedUserForModal(member);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0084ff] hover:bg-sky-100 border border-sky-200 text-xs font-bold transition-colors hidden sm:block"
                                    >
                                        Inspect Work →
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Secondary Admin Overview if configured */}
            {secondaryAdmins.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <span>Secondary Admins (Management Scope)</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                    {secondaryAdmins.length} / 2
                                </span>
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Sub-administrators managing users and work within assigned departments.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigate && onNavigate('secondary_admins')}
                            className="text-xs font-bold text-[#0084ff] hover:underline"
                        >
                            Manage Permissions →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {secondaryAdmins.map(sa => (
                            <div key={sa.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base">
                                        {sa.avatar || '🛡️'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-xs">{sa.name}</div>
                                        <div className="text-[11px] text-purple-700 font-semibold">{sa.position}</div>
                                        <div className="text-[10px] text-slate-400">Department: {sa.department}</div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-600">
                                    {Object.values(sa.permissions || {}).filter(Boolean).length} Permissions
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* User Work Modal when Admin clicks a user */}
            {selectedUserForModal && (
                <UserWorkModal
                    user={selectedUserForModal}
                    tasks={tasks}
                    onClose={() => setSelectedUserForModal(null)}
                    onAssignTask={(u) => {
                        setSelectedUserForModal(null);
                        if (onAssignTask) onAssignTask(u);
                    }}
                    onTaskClick={(t) => {
                        setSelectedUserForModal(null);
                        if (onTaskClick) onTaskClick(t);
                    }}
                />
            )}
        </div>
    );
};

export default AdminDashboardView;
