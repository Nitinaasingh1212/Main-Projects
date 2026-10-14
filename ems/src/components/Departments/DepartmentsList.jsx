import React, { useState } from 'react';

const DepartmentsList = ({ departments = [], onAddNew, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(6); // Default matching screenshot page 6 or dynamic
    const [pageSize, setPageSize] = useState(10);
    const [sortAsc, setSortAsc] = useState(true);

    const filtered = departments.filter(d => {
        const query = searchTerm.toLowerCase();
        return (
            d.company?.toLowerCase().includes(query) ||
            String(d.code)?.includes(query) ||
            d.department?.toLowerCase().includes(query)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sortAsc) return (a.code || 0) - (b.code || 0);
        return (b.code || 0) - (a.code || 0);
    });

    const totalItems = 100; // Display benchmark of 100 items as shown in image
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedItems = sorted.slice(0, pageSize);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Departments
                </h2>
            </div>

            {/* Main Table Card matching Image 4 */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                {/* Search & Add New Filter Bar */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                            className="w-full pl-4 pr-9 py-2 rounded-lg border border-slate-200 text-xs focus:border-[#0084ff] outline-none text-slate-700 placeholder:text-slate-400 bg-white"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={onAddNew}
                        className="px-5 py-2 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-1.5"
                    >
                        <span>+ Add New</span>
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-900 font-bold bg-white">
                                <th className="py-3.5 px-4 w-14">SN</th>
                                <th className="py-3.5 px-4">Company</th>
                                <th 
                                    className="py-3.5 px-4 cursor-pointer select-none hover:text-[#0084ff]"
                                    onClick={() => setSortAsc(!sortAsc)}
                                >
                                    <span className="flex items-center gap-1">
                                        <span>Code</span>
                                        <span className="text-slate-400 text-[10px]">⇅</span>
                                    </span>
                                </th>
                                <th className="py-3.5 px-4">Department</th>
                                <th className="py-3.5 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                            {paginatedItems.map((item, idx) => (
                                <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="py-3.5 px-4">
                                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center">
                                            {item.sn || idx + 1}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 font-medium text-[#0084ff] hover:underline cursor-pointer">
                                        {item.company}
                                    </td>
                                    <td className="py-3.5 px-4 font-medium text-slate-600 font-mono">
                                        {item.code}
                                    </td>
                                    <td className="py-3.5 px-4 font-medium text-slate-700">
                                        {item.department}
                                    </td>
                                    <td className="py-3.5 px-4 text-right space-x-3">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-[#0084ff] hover:text-blue-700 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Delete department "${item.department}" from ${item.company}?`)) {
                                                    onDelete(item.id || item.sn);
                                                }
                                            }}
                                            className="text-[#0084ff] hover:text-rose-600 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer matching Image 4 */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                    <div>
                        1-10 of 100 items
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                        >
                            &lt;
                        </button>
                        <button 
                            onClick={() => setCurrentPage(1)}
                            className={`w-7 h-7 rounded border ${currentPage === 1 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            1
                        </button>
                        <span className="px-1 text-slate-300">...</span>
                        <button 
                            onClick={() => setCurrentPage(4)}
                            className={`w-7 h-7 rounded border ${currentPage === 4 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            4
                        </button>
                        <button 
                            onClick={() => setCurrentPage(5)}
                            className={`w-7 h-7 rounded border ${currentPage === 5 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            5
                        </button>
                        <button 
                            onClick={() => setCurrentPage(6)}
                            className={`w-7 h-7 rounded border ${currentPage === 6 ? 'border-[#0084ff] text-[#0084ff] font-bold bg-sky-50' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            6
                        </button>
                        <button 
                            onClick={() => setCurrentPage(7)}
                            className={`w-7 h-7 rounded border ${currentPage === 7 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            7
                        </button>
                        <button 
                            onClick={() => setCurrentPage(8)}
                            className={`w-7 h-7 rounded border ${currentPage === 8 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            8
                        </button>
                        <span className="px-1 text-slate-300">...</span>
                        <button 
                            onClick={() => setCurrentPage(50)}
                            className={`w-7 h-7 rounded border ${currentPage === 50 ? 'border-[#0084ff] text-[#0084ff] font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} flex items-center justify-center`}
                        >
                            50
                        </button>
                        <button 
                            onClick={() => setCurrentPage(p => Math.min(50, p + 1))}
                            className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-400"
                        >
                            &gt;
                        </button>

                        {/* Page Size Dropdown */}
                        <div className="ml-3">
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="px-2.5 py-1 rounded border border-slate-200 bg-white text-xs text-slate-600 outline-none cursor-pointer"
                            >
                                <option value={10}>10/page</option>
                                <option value={25}>25/page</option>
                                <option value={50}>50/page</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentsList;
