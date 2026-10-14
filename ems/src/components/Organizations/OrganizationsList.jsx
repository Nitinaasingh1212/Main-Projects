import React, { useState } from 'react';

const OrganizationsList = ({ organizations = [], onAddNew, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrgs = organizations.filter(org => {
        const query = searchTerm.toLowerCase();
        return (
            org.name?.toLowerCase().includes(query) ||
            String(org.code)?.includes(query) ||
            org.city?.toLowerCase().includes(query) ||
            org.state?.toLowerCase().includes(query) ||
            org.pocName?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header with Title & Add New Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Organizations
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage all registered client enterprises, company codes, and administrators.
                    </p>
                </div>

                <button
                    onClick={onAddNew}
                    className="px-5 py-2.5 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <span>+ Add New</span>
                </button>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, code, or city..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#0084ff] outline-none text-slate-700 placeholder:text-slate-400 transition-colors bg-slate-50/50"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <span className="text-xs text-slate-400 font-medium hidden sm:block">
                        Total {organizations.length} Organizations
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-semibold bg-slate-50/50">
                                <th className="py-3 px-4 w-12 text-center">Code</th>
                                <th className="py-3 px-4">Company Name</th>
                                <th className="py-3 px-4">State & City</th>
                                <th className="py-3 px-4">PAN / GST</th>
                                <th className="py-3 px-4">Administrator (POC)</th>
                                <th className="py-3 px-4">Subscription</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                            {filteredOrgs.length > 0 ? (
                                filteredOrgs.map((org) => (
                                    <tr key={org.id || org.code} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3 px-4 text-center">
                                            <span className="font-bold text-[#0084ff] bg-sky-50 px-2 py-0.5 rounded border border-sky-100 font-mono">
                                                {org.code}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="font-bold text-slate-900">{org.name}</div>
                                            <div className="text-[11px] text-slate-400">{org.website}</div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">
                                            {org.city}, {org.state}
                                        </td>
                                        <td className="py-3 px-4 font-mono text-[11px]">
                                            <div>{org.pan || 'N/A'}</div>
                                            <div className="text-slate-400 text-[10px]">{org.gst || 'N/A'}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-slate-800 font-semibold">{org.pocName || 'POC Admin'}</div>
                                            <div className="text-[11px] text-slate-400">{org.pocEmail || org.pocPhone}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {org.subscription || 'Enterprise'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-3">
                                            <button
                                                onClick={() => onEdit(org)}
                                                className="text-[#0084ff] hover:text-blue-700 font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Delete organization "${org.name}"?`)) {
                                                        onDelete(org.id || `org-${org.code}`);
                                                    }
                                                }}
                                                className="text-slate-400 hover:text-rose-600 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-slate-400">
                                        No organizations found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrganizationsList;
