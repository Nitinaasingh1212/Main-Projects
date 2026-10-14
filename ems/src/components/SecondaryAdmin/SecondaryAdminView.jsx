import React, { useState } from 'react';

const SecondaryAdminView = ({
    secondaryAdmins = [],
    departments = [],
    positions = [],
    onAddSecondaryAdmin,
    onUpdateSecondaryAdmin,
    onDeleteSecondaryAdmin
}) => {
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('HOD - Computer Science');
    const [department, setDepartment] = useState('Computer Science');
    const [password, setPassword] = useState('123');
    const [permissions, setPermissions] = useState({
        viewUsers: true,
        addUsers: true,
        editUsers: true,
        assignWork: true,
        editWork: true,
        reviewWork: true,
        viewReports: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isMaxReached = secondaryAdmins.length >= 2;

    const openCreateModal = () => {
        if (isMaxReached) {
            alert("Maximum limit of 2 Secondary Admins has already been reached.");
            return;
        }
        setEditingAdmin(null);
        setName('');
        setEmail('');
        setPhone('');
        setPosition(positions[1] || 'HOD - Computer Science');
        setDepartment(departments[0]?.name || 'Computer Science');
        setPassword('123');
        setPermissions({
            viewUsers: true,
            addUsers: true,
            editUsers: false,
            assignWork: true,
            editWork: true,
            reviewWork: true,
            viewReports: true
        });
        setShowModal(true);
    };

    const openEditModal = (admin) => {
        setEditingAdmin(admin);
        setName(admin.name);
        setEmail(admin.email);
        setPhone(admin.phone || '');
        setPosition(admin.position);
        setDepartment(admin.department);
        setPassword(admin.password || '123');
        setPermissions(admin.permissions || {
            viewUsers: true,
            addUsers: false,
            editUsers: false,
            assignWork: true,
            editWork: true,
            reviewWork: true,
            viewReports: true
        });
        setShowModal(true);
    };

    const handleCheckboxChange = (permKey) => {
        setPermissions(prev => ({
            ...prev,
            [permKey]: !prev[permKey]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const adminData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                position,
                department,
                password,
                permissions,
                managedDepartments: [department]
            };

            if (editingAdmin) {
                await onUpdateSecondaryAdmin(editingAdmin.id, adminData);
            } else {
                await onAddSecondaryAdmin(adminData);
            }
            setShowModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const permissionLabels = [
        { key: 'viewUsers', label: 'View Users' },
        { key: 'addUsers', label: 'Add Users' },
        { key: 'editUsers', label: 'Edit Users' },
        { key: 'assignWork', label: 'Assign Work' },
        { key: 'editWork', label: 'Edit Work' },
        { key: 'reviewWork', label: 'Review Work' },
        { key: 'viewReports', label: 'View Reports' }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Secondary Admin Management</span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            isMaxReached 
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-sky-50 text-[#0084ff] border border-sky-200'
                        }`}>
                            {secondaryAdmins.length} / 2 Configured
                        </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Main Admin can create a maximum of 2 Secondary Admins (e.g., HOD, Team Lead) with granular permission controls.
                    </p>
                </div>

                <button
                    disabled={isMaxReached}
                    onClick={openCreateModal}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 ${
                        isMaxReached
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-[#0084ff] hover:bg-blue-600 text-white'
                    }`}
                >
                    <span>+ Add Secondary Admin</span>
                </button>
            </div>

            {/* Quota Banner */}
            {isMaxReached ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-xs text-amber-800">
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">🔒</span>
                        <div>
                            <strong>Maximum Quota Reached:</strong> Exactly 2 Secondary Admins are allowed per system security policy.
                            You may edit permissions or remove an existing Secondary Admin to add another.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between text-xs text-[#0084ff]">
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">🛡️</span>
                        <div>
                            <strong>Secondary Admin Role:</strong> Secondary Admins manage users and work according to their granted permissions.
                            They cannot delete or override the Main Admin.
                        </div>
                    </div>
                </div>
            )}

            {/* List of Secondary Admins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryAdmins.map((admin) => (
                    <div
                        key={admin.id}
                        className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 hover:border-[#0084ff] transition-all"
                    >
                        {/* Top Profile */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-purple-500/20">
                                    {admin.avatar || '🛡️'}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900">{admin.name}</h4>
                                    <p className="text-xs font-semibold text-[#0084ff]">{admin.position}</p>
                                    <p className="text-[11px] text-slate-400">{admin.email} • {admin.phone || 'No phone'}</p>
                                </div>
                            </div>

                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                Layer 2 Admin
                            </span>
                        </div>

                        {/* Department Scope */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Assigned Department Scope:</span>
                            <span className="font-bold text-slate-800">{admin.department}</span>
                        </div>

                        {/* Permissions Grid */}
                        <div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                Granted Permissions:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {permissionLabels.map(({ key, label }) => {
                                    const hasPerm = admin.permissions?.[key];
                                    return (
                                        <span
                                            key={key}
                                            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                                                hasPerm
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
                                            }`}
                                        >
                                            {hasPerm ? `✓ ${label}` : label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                            <button
                                onClick={() => openEditModal(admin)}
                                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                            >
                                Edit Permissions
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove ${admin.name} as Secondary Admin?`)) {
                                        onDeleteSecondaryAdmin(admin.id);
                                    }
                                }}
                                className="px-3.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 font-semibold text-xs transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {secondaryAdmins.length === 0 && (
                    <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-white p-8">
                        <span className="text-4xl block mb-2">🛡️</span>
                        <h4 className="text-sm font-bold text-slate-800">No Secondary Admins Configured</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                            Secondary Admin is optional. You can add up to 2 Secondary Admins (e.g., HODs or Team Leads) to delegate user oversight and work reviews.
                        </p>
                        <button
                            onClick={openCreateModal}
                            className="mt-4 px-4 py-2 bg-[#0084ff] text-white rounded-xl text-xs font-bold hover:bg-blue-600"
                        >
                            + Add First Secondary Admin
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Add / Edit Secondary Admin */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {editingAdmin ? "✏️ Edit Secondary Admin" : "🛡️ Add Secondary Admin"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Main Admin defines credentials and granular management permissions.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                            {/* Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Dr. Alok Verma"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Email Address <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alok@teamwork.com"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                                    />
                                </div>
                            </div>

                            {/* Phone & Password */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 98112 23344"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Password <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Position & Department */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Position</label>
                                    <input
                                        type="text"
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        placeholder="e.g. HOD - Computer Science / Team Lead"
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Department Scope</label>
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                                    >
                                        {departments.map(d => (
                                            <option key={d.id || d.name} value={d.name}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Granular Permissions (prompt Section 14) */}
                            <div>
                                <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
                                    Granular Permissions (Main Admin Controls):
                                </label>
                                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    {permissionLabels.map(({ key, label }) => (
                                        <label key={key} className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(permissions[key])}
                                                onChange={() => handleCheckboxChange(key)}
                                                className="w-4 h-4 rounded text-[#0084ff] focus:ring-0 cursor-pointer"
                                            />
                                            <span className="font-semibold text-slate-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
                                >
                                    {isSubmitting ? "Saving..." : (editingAdmin ? "Update Permissions" : "Add Secondary Admin")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecondaryAdminView;
