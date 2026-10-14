import React, { useState } from 'react';

const UsersList = ({ employees = [], organizations = [], onAddNewUser, onAssignTask, onStartMeet, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('All');

    const filtered = employees.filter(emp => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = (
            emp.firstName?.toLowerCase().includes(query) ||
            emp.email?.toLowerCase().includes(query) ||
            emp.designation?.toLowerCase().includes(query) ||
            emp.department?.toLowerCase().includes(query) ||
            emp.company?.toLowerCase().includes(query)
        );
        const matchesCompany = selectedCompany === 'All' || emp.company === selectedCompany;
        return matchesSearch && matchesCompany;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Users & Team Members
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage all platform users, department assignments, and performance roles.
                    </p>
                </div>

                <button
                    onClick={onAddNewUser}
                    className="px-5 py-2.5 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <span>+ Add New User</span>
                </button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center flex-wrap gap-3">
                        <div className="relative w-72">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, email, role..."
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#0084ff] outline-none text-slate-700 placeholder:text-slate-400 bg-slate-50/50"
                            />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Company Filter Dropdown */}
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white outline-none cursor-pointer"
                        >
                            <option value="All">All Companies</option>
                            {organizations.map(org => (
                                <option key={org.id || org.code} value={org.name}>
                                    {org.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <span className="text-xs text-slate-400 font-medium">
                        Showing {filtered.length} Users
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                                <th className="py-3 px-4">User</th>
                                <th className="py-3 px-4">Company & Code</th>
                                <th className="py-3 px-4">Department</th>
                                <th className="py-3 px-4">Hierarchy Layer</th>
                                <th className="py-3 px-4 text-center">Active Tasks</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {filtered.map((emp) => (
                                <tr key={emp.id || emp.docId} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                                                {emp.avatar || emp.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{emp.firstName}</div>
                                                <div className="text-[11px] text-slate-400">{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <div className="text-slate-800 font-medium">{emp.company || 'HCL Technologies'}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">Code: {emp.companyCode || 10005}</div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="text-slate-700">{emp.department || 'Engineering'}</span>
                                        <div className="text-[11px] text-slate-400">{emp.designation}</div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                            Layer {emp.hierarchyLevel || 3}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                                {emp.taskCounts?.active || 0} In Progress
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                                {emp.taskCounts?.completed || 0} Done
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right space-x-2">
                                        <button
                                            onClick={() => onAssignTask(emp)}
                                            className="px-2.5 py-1 rounded bg-sky-50 text-[#0084ff] border border-sky-200 hover:bg-sky-100 font-semibold text-[11px] transition-colors"
                                        >
                                            Assign Task
                                        </button>
                                        <button
                                            onClick={() => onStartMeet(emp)}
                                            className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                                        >
                                            1-on-1 Meet
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Delete user ${emp.firstName}?`)) {
                                                    onDeleteUser(emp.id || emp.docId);
                                                }
                                            }}
                                            className="text-slate-400 hover:text-rose-600 font-medium text-[11px] px-1"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersList;
