import React, { useState } from 'react';

const CreateDepartment = ({ organizations = [], onCancel, onSubmitSuccess }) => {
    const [selectedCompanyName, setSelectedCompanyName] = useState(
        organizations.length > 0 ? organizations[0].name : 'HCL Technologies'
    );
    const [departmentName, setDepartmentName] = useState('');
    const [loading, setLoading] = useState(false);

    // Look up company code for selected company
    const selectedOrg = organizations.find(o => o.name === selectedCompanyName);
    const currentCode = selectedOrg?.code || 10011;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!departmentName.trim()) {
            alert('Please enter a department name.');
            return;
        }

        setLoading(true);
        const newDept = {
            company: selectedCompanyName,
            code: currentCode,
            department: departmentName.trim(),
            status: 'Active'
        };

        try {
            await onSubmitSuccess(newDept);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Breadcrumbs Header */}
            <div>
                <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2">
                    <span className="cursor-pointer hover:text-slate-600" onClick={onCancel}>Home</span>
                    <span>/</span>
                    <span className="cursor-pointer hover:text-slate-600" onClick={onCancel}>Departments</span>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold">Create</span>
                </nav>
                <p className="text-xs text-slate-400">
                    Add new department on the platform by filling the following details
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Card matching Image 5 */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <h3 className="text-base font-bold text-slate-800">
                            Company Information
                        </h3>
                        <span className="text-xs font-bold text-[#0084ff] bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg font-mono">
                            Company Code : {currentCode}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name Selector */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Company Name
                            </label>
                            <select
                                value={selectedCompanyName}
                                onChange={(e) => setSelectedCompanyName(e.target.value)}
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 bg-white cursor-pointer transition-colors"
                            >
                                {organizations.map((org) => (
                                    <option key={org.id || org.code} value={org.name}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Name Input */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">
                                Department Name
                            </label>
                            <input
                                required
                                type="text"
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                placeholder="Enter your department name"
                                className="w-full text-xs py-2.5 px-3.5 rounded-lg border border-slate-200 focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Action Buttons matching Image 5 */}
                <div className="flex items-center justify-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-2.5 rounded-lg border border-sky-300 text-sky-600 hover:bg-sky-50 font-semibold text-xs transition-colors bg-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 rounded-lg bg-[#0084ff] hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDepartment;
