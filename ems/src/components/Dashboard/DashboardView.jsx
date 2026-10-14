import React, { useState } from 'react';

const DashboardView = ({ organizations = [], employees = [], onNavigate }) => {
    const [timeRange, setTimeRange] = useState('All year');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Most active organizations leaderboard matching Image 1
    const leaderboard = [
        { rank: 1, name: 'Accenture', count: '323,234' },
        { rank: 2, name: 'Wipro', count: '223,234' },
        { rank: 3, name: 'Infosys', count: '123,234' },
        { rank: 4, name: 'TCS', count: '33,234' },
        { rank: 5, name: 'HCL', count: '23,234' },
        { rank: 6, name: 'Unilever', count: '12,234' },
        { rank: 7, name: 'Nestle', count: '3,234' },
    ];

    // Chart mock trend points
    const trendData = [
        { month: 'Jan', tasks: 45, completed: 38 },
        { month: 'Feb', tasks: 72, completed: 60 },
        { month: 'Mar', tasks: 95, completed: 82 },
        { month: 'Apr', tasks: 68, completed: 55 },
        { month: 'May', tasks: 110, completed: 98 },
        { month: 'Jun', tasks: 85, completed: 78 },
        { month: 'Jul', tasks: 130, completed: 115 },
        { month: 'Aug', tasks: 105, completed: 92 },
        { month: 'Sep', tasks: 145, completed: 130 },
        { month: 'Oct', tasks: 160, completed: 148 },
        { month: 'Nov', tasks: 120, completed: 105 },
        { month: 'Dec', tasks: 180, completed: 165 },
    ];

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Top Greeting & Active Organizations Banner */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Hello Nitin, have a great day ahead!
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Designed to enhance productivity and streamline operations within an organization.
                    </p>
                </div>

                <div className="text-right border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 flex-shrink-0">
                    <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                        Active Organizations
                    </span>
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        233
                    </span>
                </div>
            </div>

            {/* 4 Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Stat 1: New Organizations */}
                <div 
                    onClick={() => onNavigate && onNavigate('organizations')} 
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                            New Organizations
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900">2</h3>
                        <p className="text-xs text-slate-400 mt-1">This month</p>
                    </div>
                </div>

                {/* Stat 2: New Users */}
                <div 
                    onClick={() => onNavigate && onNavigate('users')}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                            New Users
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900">2</h3>
                        <p className="text-xs text-slate-400 mt-1">This month</p>
                    </div>
                </div>

                {/* Stat 3: New Tasks */}
                <div 
                    onClick={() => onNavigate && onNavigate('tasks')}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                            New Tasks
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900">25</h3>
                        <p className="text-xs text-slate-400 mt-1">Today</p>
                    </div>
                </div>

                {/* Stat 4: Active Organizations */}
                <div 
                    onClick={() => onNavigate && onNavigate('organizations')}
                    className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:border-sky-300 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">
                            Active Organizations
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl font-bold text-slate-900">2</h3>
                        <p className="text-xs text-slate-400 mt-1">This month</p>
                    </div>
                </div>
            </div>

            {/* Tasks Analytics Card with Leaderboard & Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                {/* Filter Navigation Bar */}
                <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    {/* Left: Tab Title */}
                    <div className="flex items-center gap-6">
                        <button className="text-sm font-bold text-[#0084ff] border-b-2 border-[#0084ff] pb-1 -mb-[18px] transition-all">
                            Tasks
                        </button>
                    </div>

                    {/* Right: Time Range Buttons & Date Range Picker */}
                    <div className="flex items-center flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            {['All day', 'All week', 'All month', 'All year'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                                        timeRange === range
                                            ? 'text-[#0084ff] font-bold'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>

                        {/* Date Range Picker Input */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                            <input
                                type="text"
                                placeholder="Start date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-20 text-slate-700 placeholder:text-slate-400"
                            />
                            <span className="text-slate-400">→</span>
                            <input
                                type="text"
                                placeholder="End date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-20 text-slate-700 placeholder:text-slate-400"
                            />
                            <svg className="w-4 h-4 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Main Content Split: Chart & Leaderboard */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Tasks Creation Trend Chart */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                        <div className="mb-4">
                            <h4 className="text-sm font-bold text-slate-800">
                                Tasks Creation Trend
                            </h4>
                            <p className="text-xs text-slate-400">
                                Real-time volume of operations and task execution across all connected clients.
                            </p>
                        </div>

                        {/* Interactive SVG Chart */}
                        <div className="h-64 w-full relative flex items-end justify-between pt-8 pb-4 px-2 border-b border-slate-100">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                                <div className="border-b border-dashed border-slate-200 w-full"></div>
                            </div>

                            {/* Trend Bars */}
                            {trendData.map((point, index) => {
                                const heightPercent = Math.min(100, Math.round((point.tasks / 190) * 100));
                                return (
                                    <div key={index} className="flex flex-col items-center flex-1 z-10 group cursor-pointer">
                                        <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg relative flex items-end justify-center h-48 overflow-hidden">
                                            <div 
                                                style={{ height: `${heightPercent}%` }}
                                                className="w-full bg-gradient-to-t from-[#0084ff] to-sky-400 rounded-t-lg transition-all duration-300 group-hover:from-sky-600 group-hover:to-blue-500 shadow-sm"
                                            ></div>
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-400 mt-2 group-hover:text-slate-800 transition-colors">
                                            {point.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-[#0084ff]"></span>
                                    Task Creation Volume
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-200"></span>
                                    Historical Baseline
                                </span>
                            </div>
                            <span className="font-semibold text-slate-600">
                                Total 1,350+ Tasks Executed
                            </span>
                        </div>
                    </div>

                    {/* Right: Most Active Organizations Leaderboard */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8">
                        <h4 className="text-sm font-bold text-slate-800 mb-4">
                            Most Active Organizations
                        </h4>

                        <div className="space-y-3.5">
                            {leaderboard.map((item) => (
                                <div key={item.rank} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm shadow-rose-200">
                                            {item.rank}
                                        </span>
                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-500 font-mono">
                                        {item.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
