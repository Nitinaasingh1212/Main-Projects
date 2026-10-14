import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import EditHierarchyModal from './EditHierarchyModal';
import ScheduleMeetingModal from '../Meetings/ScheduleMeetingModal';

const LAYER_DEFINITIONS = [
    {
        level: 1,
        title: "Layer 1: Strategic & Executive Leadership",
        description: "Organization directors, founders, and Super Admins determining overarching vision and strategic goals.",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        borderColor: "border-amber-200",
        bgColor: "bg-amber-50/30",
        icon: "👑"
    },
    {
        level: 2,
        title: "Layer 2: Management & Engineering Leads",
        description: "Technical leads, engineering managers, and product heads overseeing architecture, sprints, and project delivery.",
        badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
        borderColor: "border-purple-200",
        bgColor: "bg-purple-50/30",
        icon: "🧭"
    },
    {
        level: 3,
        title: "Layer 3: Senior Specialists & Cloud Engineers",
        description: "Core full-stack engineers, cloud architects, DevOps specialists, and senior designers driving implementation.",
        badgeColor: "bg-sky-50 text-[#0084ff] border-sky-200",
        borderColor: "border-sky-200",
        bgColor: "bg-sky-50/30",
        icon: "⚡"
    },
    {
        level: 4,
        title: "Layer 4: Associates & Operations Specialists",
        description: "Associate developers, UI/UX engineers, and QA analysts building features, writing tests, and optimizing workflows.",
        badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
        borderColor: "border-emerald-200",
        bgColor: "bg-emerald-50/30",
        icon: "🛠️"
    },
    {
        level: 5,
        title: "Layer 5: Trainees & Research Apprentices",
        description: "Apprentice engineers and research interns collaborating with mentors on exploratory initiatives and learning tracks.",
        badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
        borderColor: "border-rose-200",
        bgColor: "bg-rose-50/30",
        icon: "🌱"
    }
];

const HierarchyFlow = ({ currentUser, isAdmin = false, onAssignTaskToEmployee }) => {
    const [userData] = useContext(AuthContext) || [[]];
    const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState(null);
    const [selectedEmployeeForMeet, setSelectedEmployeeForMeet] = useState(null);
    const [selectedLayerFilter, setSelectedLayerFilter] = useState('all');
    const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('all');

    const employees = userData || [];

    // Filter employees by layer and department
    const filteredEmployees = employees.filter(emp => {
        const matchesLayer = selectedLayerFilter === 'all' || String(emp.hierarchyLevel || 3) === String(selectedLayerFilter);
        const matchesDept = selectedDepartmentFilter === 'all' || emp.department === selectedDepartmentFilter;
        return matchesLayer && matchesDept;
    });

    const employeesByLayer = {
        1: filteredEmployees.filter(e => (e.hierarchyLevel || 3) === 1),
        2: filteredEmployees.filter(e => (e.hierarchyLevel || 3) === 2),
        3: filteredEmployees.filter(e => (e.hierarchyLevel || 3) === 3),
        4: filteredEmployees.filter(e => (e.hierarchyLevel || 3) === 4),
        5: filteredEmployees.filter(e => (e.hierarchyLevel || 3) === 5),
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Organization Hierarchy Chart</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            5-Tier Flow
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Visualize organizational structures, reporting lines, and direct task assignments.
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-3">
                    <select
                        value={selectedLayerFilter}
                        onChange={(e) => setSelectedLayerFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white outline-none cursor-pointer"
                    >
                        <option value="all">All 5 Layers</option>
                        <option value="1">Layer 1: Leadership</option>
                        <option value="2">Layer 2: Leads & Managers</option>
                        <option value="3">Layer 3: Specialists</option>
                        <option value="4">Layer 4: Associates</option>
                        <option value="5">Layer 5: Interns</option>
                    </select>
                </div>
            </div>

            {/* Hierarchy Tree Container */}
            <div className="space-y-6">
                {LAYER_DEFINITIONS.map((layer) => {
                    if (selectedLayerFilter !== 'all' && String(layer.level) !== String(selectedLayerFilter)) {
                        return null;
                    }

                    const layerEmployees = employeesByLayer[layer.level] || [];

                    return (
                        <div
                            key={layer.level}
                            className={`rounded-2xl border p-6 bg-white shadow-sm ${layer.borderColor}`}
                        >
                            {/* Layer Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{layer.icon}</span>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">
                                            {layer.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {layer.description}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start sm:self-auto ${layer.badgeColor}`}>
                                    {layerEmployees.length} Members
                                </span>
                            </div>

                            {/* Employees Grid in this Layer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {layerEmployees.length > 0 ? (
                                    layerEmployees.map((emp) => (
                                        <div
                                            key={emp.id || emp.docId}
                                            className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 font-mono">
                                                        {emp.company || 'HCL Technologies'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        Reports to: <strong className="text-slate-700">{emp.reportsTo || 'Nitin'}</strong>
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                                                        {emp.avatar || emp.firstName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 capitalize">
                                                            {emp.firstName}
                                                        </h4>
                                                        <p className="text-xs text-slate-500">
                                                            {emp.designation}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400">
                                                            {emp.department || 'Operations'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                                                {onAssignTaskToEmployee && (
                                                    <button
                                                        onClick={() => onAssignTaskToEmployee(emp.firstName)}
                                                        className="px-2.5 py-1 rounded bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-[11px] transition-colors"
                                                    >
                                                        Assign Task
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedEmployeeForMeet(emp)}
                                                    className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                                                >
                                                    1-on-1 Meet
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setSelectedEmployeeForEdit(emp)}
                                                        className="text-xs text-slate-400 hover:text-slate-700 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                                        No members currently assigned to Layer {layer.level}.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Edit Hierarchy Modal */}
            {selectedEmployeeForEdit && (
                <EditHierarchyModal
                    employee={selectedEmployeeForEdit}
                    onClose={() => setSelectedEmployeeForEdit(null)}
                />
            )}

            {/* 1-on-1 Schedule Meeting Modal */}
            {selectedEmployeeForMeet && (
                <ScheduleMeetingModal
                    currentUser={currentUser}
                    prefilledAttendee={selectedEmployeeForMeet.firstName}
                    onClose={() => setSelectedEmployeeForMeet(null)}
                />
            )}
        </div>
    );
};

export default HierarchyFlow;
