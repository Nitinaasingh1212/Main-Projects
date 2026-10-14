import React, { useState } from 'react';
import AddUserModal from './AddUserModal';
import UserWorkModal from './UserWorkModal';

const AdminUsersView = ({
    users = [],
    tasks = [],
    positions = [],
    departments = [],
    onAddUser,
    onUpdateUser,
    onToggleStatus,
    onDeleteUser,
    onAssignTask,
    onTaskClick
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [inspectedUser, setInspectedUser] = useState(null);

    // Calculate user task statistics
    const enrichedUsers = users.map(user => {
        const userTasks = tasks.filter(t => t.assignedToId === user.id);
        const completed = userTasks.filter(t => t.status === 'COMPLETED').length;
        const pending = userTasks.filter(t => t.status !== 'COMPLETED').length;
        const progress = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0;
        return {
            ...user,
            totalTasks: userTasks.length,
            completedTasks: completed,
            pendingTasks: pending,
            progress
        };
    });

    const filteredUsers = enrichedUsers.filter(u => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = (
            u.name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.position?.toLowerCase().includes(query) ||
            u.employeeId?.toLowerCase().includes(query) ||
            u.team?.toLowerCase().includes(query)
        );

        const matchesDept = selectedDeptFilter === 'ALL' || u.department === selectedDeptFilter;
        const matchesStatus = selectedStatusFilter === 'ALL' || u.status === selectedStatusFilter;

        return matchesSearch && matchesDept && matchesStatus;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Team Members & User Directory</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0084ff] border border-sky-200">
                            {users.length} Users
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage all platform users, assign positions, inspect workloads, and grant access.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setShowAddModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <span>+ Add User</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center flex-wrap gap-3 flex-1 min-w-[280px]">
                    <div className="relative w-72">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, email, ID, position..."
                            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={selectedDeptFilter}
                        onChange={(e) => setSelectedDeptFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white cursor-pointer"
                    >
                        <option value="ALL">All Departments</option>
                        {departments.map(d => (
                            <option key={d.id || d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none text-slate-700 bg-white cursor-pointer"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Active">🟢 Active</option>
                        <option value="Inactive">⚪ Inactive</option>
                    </select>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                    Showing {filteredUsers.length} of {users.length} members
                </span>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/70">
                                <th className="py-3 px-4">Member</th>
                                <th className="py-3 px-4">Position / Role</th>
                                <th className="py-3 px-4">Department & Team</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-center">Workload & Tasks</th>
                                <th className="py-3 px-4">Progress</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0084ff] flex items-center justify-center text-xl mx-auto mb-2 border border-sky-100">
                                            👥
                                        </div>
                                        <p className="text-sm font-bold text-slate-800">No team members found</p>
                                        <p className="text-xs text-slate-400 mt-0.5 mb-3">
                                            {users.length === 0 ? "You're starting fresh from scratch! Click below to enroll your first colleague." : "No users matched your active search or filter."}
                                        </p>
                                        {users.length === 0 && (
                                            <button
                                                onClick={() => {
                                                    setEditingUser(null);
                                                    setShowAddModal(true);
                                                }}
                                                className="px-4 py-2 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors"
                                            >
                                                + Add First Member
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                        {/* Member info */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {user.avatar || user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                                        <span>{user.email}</span>
                                                        <span className="font-mono bg-slate-100 px-1 rounded text-[10px]">{user.employeeId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Position */}
                                        <td className="py-3.5 px-4">
                                            <span className="font-bold text-[#0084ff]">{user.position}</span>
                                            <div className="text-[10px] text-slate-400">Joined {user.joiningDate}</div>
                                        </td>

                                        {/* Department & Team */}
                                        <td className="py-3.5 px-4">
                                            <div className="text-slate-800 font-semibold">{user.department}</div>
                                            <div className="text-[11px] text-slate-400">Team: {user.team || 'Core'}</div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4">
                                            <button
                                                onClick={() => onToggleStatus && onToggleStatus(user.id)}
                                                title="Click to toggle status"
                                                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                                                    user.status === 'Active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                                }`}
                                            >
                                                {user.status === 'Active' ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>

                                        {/* Task counts */}
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-sky-50 text-[#0084ff] border border-sky-200 text-[11px] font-bold">
                                                    {user.totalTasks} Total
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                                    {user.completedTasks} Done
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                                    {user.pendingTasks} Pending
                                                </span>
                                            </div>
                                        </td>

                                        {/* Progress bar */}
                                        <td className="py-3.5 px-4">
                                            <div className="w-24">
                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                                                    <span>{user.progress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-[#0084ff] h-full rounded-full transition-all"
                                                        style={{ width: `${user.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Action buttons */}
                                        <td className="py-3.5 px-4 text-right space-x-1.5">
                                            <button
                                                onClick={() => setInspectedUser(user)}
                                                className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0084ff] border border-sky-200 hover:bg-sky-100 font-bold text-[11px] transition-colors"
                                            >
                                                View Work
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setShowAddModal(true);
                                                }}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${user.name}? This will remove all their work assignments.`)) {
                                                        onDeleteUser(user.id);
                                                    }
                                                }}
                                                className="px-2 py-1 text-slate-400 hover:text-rose-600 font-semibold text-[11px] transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit User Modal */}
            {showAddModal && (
                <AddUserModal
                    initialData={editingUser}
                    positions={positions}
                    departments={departments}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingUser(null);
                    }}
                    onSubmitSuccess={(userData) => {
                        if (editingUser) {
                            onUpdateUser(editingUser.id, userData);
                        } else {
                            onAddUser(userData);
                        }
                    }}
                />
            )}

            {/* User Work Modal */}
            {inspectedUser && (
                <UserWorkModal
                    user={inspectedUser}
                    tasks={tasks}
                    onClose={() => setInspectedUser(null)}
                    onAssignTask={(u) => {
                        setInspectedUser(null);
                        if (onAssignTask) onAssignTask(u);
                    }}
                    onTaskClick={(t) => {
                        setInspectedUser(null);
                        if (onTaskClick) onTaskClick(t);
                    }}
                />
            )}
        </div>
    );
};

export default AdminUsersView;
