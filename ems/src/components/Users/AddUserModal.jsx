import React, { useState } from 'react';

const AddUserModal = ({
    initialData = null,
    positions = [],
    departments = [],
    onClose,
    onSubmitSuccess
}) => {
    const isEdit = Boolean(initialData);

    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [position, setPosition] = useState(initialData?.position || positions[0] || 'Frontend Developer');
    const [customPosition, setCustomPosition] = useState('');
    const [department, setDepartment] = useState(initialData?.department || departments[0]?.name || 'Computer Science');
    const [team, setTeam] = useState(initialData?.team || 'Core Web');
    const [employeeId, setEmployeeId] = useState(initialData?.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    const [password, setPassword] = useState(initialData?.password || '123');
    const [avatar, setAvatar] = useState(initialData?.avatar || '👤');
    const [status, setStatus] = useState(initialData?.status || 'Active');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const avatarPresets = ['👤', '👨‍💻', '👩‍💻', '👨‍🏫', '👩‍🏫', '👩‍🎨', '🧑‍🔬', '👨‍🔬', '👑', '⭐'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        setIsSubmitting(true);
        try {
            const finalPosition = position === '__custom__' ? customPosition.trim() : position;
            const userData = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone.trim(),
                position: finalPosition || 'Team Member',
                department,
                team,
                employeeId,
                password: password.trim() || '123',
                avatar,
                status,
                joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0]
            };

            await onSubmitSuccess(userData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                            {isEdit ? "✏️ Edit Team Member" : "👤 Add New Team Member"}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Configure user credentials, position, department, and system access.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Avatar picker */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Avatar / Profile Icon</label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {avatarPresets.map(av => (
                                <button
                                    key={av}
                                    type="button"
                                    onClick={() => setAvatar(av)}
                                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                                        avatar === av 
                                            ? 'bg-sky-100 border-2 border-[#0084ff] scale-110 shadow-sm' 
                                            : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    {av}
                                </button>
                            ))}
                        </div>
                    </div>

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
                                placeholder="e.g. Rahul Sharma"
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
                                placeholder="rahul@teamwork.com"
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 placeholder:text-slate-400 bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* Phone & ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Employee / Student ID <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="e.g. CS-2026-01"
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50 font-mono"
                            />
                        </div>
                    </div>

                    {/* Position (Dynamic + Custom Option) */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Position / Role <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                        >
                            {positions.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                            <option value="__custom__">+ Enter Custom Position...</option>
                        </select>

                        {position === '__custom__' && (
                            <input
                                required
                                type="text"
                                value={customPosition}
                                onChange={(e) => setCustomPosition(e.target.value)}
                                placeholder="Type custom position (e.g. Student Coordinator, AI Specialist)..."
                                className="w-full mt-2 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-sky-50/40"
                            />
                        )}
                    </div>

                    {/* Department & Team */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
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

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Team / Sub-unit</label>
                            <input
                                type="text"
                                value={team}
                                onChange={(e) => setTeam(e.target.value)}
                                placeholder="e.g. Core Web, ML Lab, Hackathon Alpha"
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50"
                            />
                        </div>
                    </div>

                    {/* Password & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Login Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Temporary password"
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-slate-50/50 font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-[#0084ff] outline-none text-slate-800 bg-white"
                            >
                                <option value="Active">🟢 Active</option>
                                <option value="Inactive">⚪ Inactive / Suspended</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-[#0084ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
                        >
                            {isSubmitting ? "Saving..." : (isEdit ? "Update User" : "Create User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
