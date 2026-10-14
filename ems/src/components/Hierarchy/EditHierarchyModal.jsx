import React, { useState, useEffect } from 'react';
import { updateEmployeeHierarchy } from '../../firebase/firestoreService';

const EditHierarchyModal = ({ employee, onClose, onUpdated }) => {
    const [designation, setDesignation] = useState(employee?.designation || '');
    const [department, setDepartment] = useState(employee?.department || 'Operations');
    const [hierarchyLevel, setHierarchyLevel] = useState(employee?.hierarchyLevel || 3);
    const [reportsTo, setReportsTo] = useState(employee?.reportsTo || 'Nitin');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const targetId = employee.docId || employee.id || employee.firstName;

        try {
            await updateEmployeeHierarchy(targetId, {
                designation,
                department,
                hierarchyLevel: Number(hierarchyLevel),
                reportsTo
            });

            if (onUpdated) onUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating hierarchy:', err);
            alert(err.message || 'Failed to update hierarchy.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Edit Hierarchy Role</h3>
                        <p className="text-xs text-slate-400">Update layer and reporting structure for {employee.firstName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
                        <input
                            required
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                        <input
                            required
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Hierarchy Layer</label>
                        <select
                            value={hierarchyLevel}
                            onChange={(e) => setHierarchyLevel(e.target.value)}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none bg-white"
                        >
                            <option value={1}>Layer 1: Strategic & Executive Leadership</option>
                            <option value={2}>Layer 2: Management & Engineering Leads</option>
                            <option value={3}>Layer 3: Senior Specialists & Cloud Engineers</option>
                            <option value={4}>Layer 4: Associates & Operations Specialists</option>
                            <option value={5}>Layer 5: Trainees & Research Apprentices</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Reports To</label>
                        <input
                            required
                            type="text"
                            value={reportsTo}
                            onChange={(e) => setReportsTo(e.target.value)}
                            className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditHierarchyModal;
