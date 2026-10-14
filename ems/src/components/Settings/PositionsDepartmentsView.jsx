import React, { useState } from 'react';

const PositionsDepartmentsView = ({
    positions = [],
    departments = [],
    onAddPosition,
    onAddDepartment,
    onSwitchPreset,
    onResetToScratch
}) => {
    const [newPositionName, setNewPositionName] = useState('');
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptHead, setNewDeptHead] = useState('');
    const [newDeptTeam, setNewDeptTeam] = useState('');

    const handleCreatePosition = (e) => {
        e.preventDefault();
        if (newPositionName.trim()) {
            onAddPosition(newPositionName.trim());
            setNewPositionName('');
        }
    };

    const handleCreateDept = (e) => {
        e.preventDefault();
        if (newDeptName.trim()) {
            onAddDepartment({
                name: newDeptName.trim(),
                head: newDeptHead.trim() || 'TBD',
                teams: newDeptTeam.trim() ? [newDeptTeam.trim()] : ['General']
            });
            setNewDeptName('');
            setNewDeptHead('');
            setNewDeptTeam('');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Dynamic Positions & Departments Configuration
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Customize roles and organization hierarchies for Universities, Hackathons, Colleges, or Project Teams.
                    </p>
                </div>

                {/* Preset switcher and scratch buttons */}
                <div className="flex items-center flex-wrap gap-2">
                    <button
                        onClick={() => onSwitchPreset('university')}
                        className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[#0084ff] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <span>🎓 University Preset</span>
                    </button>
                    <button
                        onClick={() => onSwitchPreset('hackathon')}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <span>🚀 Hackathon Preset</span>
                    </button>
                    {onResetToScratch && (
                        <button
                            onClick={onResetToScratch}
                            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                            title="Clear workspace tasks & members to build from scratch"
                        >
                            <span>🧹 Start from Scratch</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Card: Dynamic Positions */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <span>🏷️ Configured Positions</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {positions.length} Positions
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Positions are fully dynamic and can represent academic ranks or technical team designations.
                        </p>
                    </div>

                    {/* Positions Badges List */}
                    <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-slate-50/70 border border-slate-100 min-h-[140px]">
                        {positions.map((pos, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff]"></span>
                                <span>{pos}</span>
                            </span>
                        ))}
                    </div>

                    {/* Add Position Form */}
                    <form onSubmit={handleCreatePosition} className="space-y-3 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-700">
                            + Add New Custom Position
                        </label>
                        <div className="flex gap-2">
                            <input
                                required
                                type="text"
                                value={newPositionName}
                                onChange={(e) => setNewPositionName(e.target.value)}
                                placeholder="e.g. Dean, Research Fellow, Mobile Developer..."
                                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm"
                            >
                                Add Position
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Card: Dynamic Departments & Teams */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <span>🏛️ Departments & Teams</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {departments.length} Depts
                            </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Organize staff and members by academic departments or project focus units.
                        </p>
                    </div>

                    {/* Departments List */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto">
                        {departments.map((dept) => (
                            <div key={dept.id || dept.name} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-xs text-slate-900">{dept.name}</div>
                                    <div className="text-[11px] text-slate-400">
                                        Head: <strong className="text-slate-600">{dept.head}</strong> • Code: {dept.code || 'DEPT'}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {(dept.teams || []).map((t, i) => (
                                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-[#0084ff]">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Department Form */}
                    <form onSubmit={handleCreateDept} className="space-y-3 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-semibold text-slate-700">
                            + Add New Department
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                                required
                                type="text"
                                value={newDeptName}
                                onChange={(e) => setNewDeptName(e.target.value)}
                                placeholder="Department name (e.g. AI Research Centre)"
                                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                            <input
                                type="text"
                                value={newDeptHead}
                                onChange={(e) => setNewDeptHead(e.target.value)}
                                placeholder="Lead / Head Name (e.g. Dr. Sunita)"
                                className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newDeptTeam}
                                onChange={(e) => setNewDeptTeam(e.target.value)}
                                placeholder="Sub-team name (e.g. Core Web, Machine Learning)"
                                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-sm"
                            >
                                Add Dept
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PositionsDepartmentsView;
