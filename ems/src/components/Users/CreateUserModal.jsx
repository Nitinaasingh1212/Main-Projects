import React, { useState } from 'react';

const CreateUserModal = ({ organizations = [], departments = [], onClose, onSubmitSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('123');
    const [company, setCompany] = useState(organizations.length > 0 ? organizations[0].name : 'HCL Technologies');
    const [department, setDepartment] = useState('Engineering');
    const [designation, setDesignation] = useState('Operations Specialist');
    const [hierarchyLevel, setHierarchyLevel] = useState(3);
    const [reportsTo, setReportsTo] = useState('Nitin');
    const [loading, setLoading] = useState(false);

    const selectedOrg = organizations.find(o => o.name === company);
    const companyCode = selectedOrg?.code || 10005;

    // Filter departments for selected company
    const availableDepartments = departments.filter(d => d.company === company);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newUserData = {
            firstName,
            email,
            password,
            company,
            companyCode,
            department,
            designation,
            hierarchyLevel: Number(hierarchyLevel),
            reportsTo,
            avatar: '👤'
        };

        try {
            await onSubmitSuccess(newUserData);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Add New User / Employee</h3>
                        <p className="text-xs text-slate-400">Create profile and assign to organization & hierarchy layer</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                            <input
                                required
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="e.g. Ramesh Verma"
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                            <select
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none bg-white"
                            >
                                {organizations.map(org => (
                                    <option key={org.id || org.code} value={org.name}>
                                        {org.name} ({org.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="e.g. Operations, IT"
                                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 focus:border-[#0084ff] outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Designation</label>
                            <input
                                required
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                placeholder="e.g. Senior Architect"
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
                                <option value={1}>Layer 1: Strategic Leadership</option>
                                <option value={2}>Layer 2: Management & Leads</option>
                                <option value={3}>Layer 3: Senior Specialists</option>
                                <option value={4}>Layer 4: Associates & Junior</option>
                                <option value={5}>Layer 5: Interns & Trainees</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Reports To</label>
                        <input
                            type="text"
                            value={reportsTo}
                            onChange={(e) => setReportsTo(e.target.value)}
                            placeholder="e.g. Nitin or Manager"
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
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
