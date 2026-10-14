import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import { addEmployeeProfile } from '../../firebase/firestoreService';

const CreateEmployeeModal = ({ onClose }) => {
    const [userData, setUserData] = useContext(AuthContext) || [[]];
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('123');
    const [designation, setDesignation] = useState('Software Engineer');
    const [department, setDepartment] = useState('Engineering');
    const [hierarchyLevel, setHierarchyLevel] = useState(3);
    const [reportsTo, setReportsTo] = useState('Admin');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    // Close on Escape key press
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
        setStatusMessage(null);

        try {
            const res = await addEmployeeProfile({
                firstName,
                email,
                password,
                designation,
                department,
                hierarchyLevel: Number(hierarchyLevel),
                reportsTo
            });

            if (res?.localData && setUserData) {
                setUserData(res.localData);
            }

            setStatusMessage({
                type: 'success',
                text: `✅ Profile created successfully for ${firstName} with Hierarchy Layer ${hierarchyLevel}!`
            });

            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (error) {
            console.error("Error creating employee profile:", error);
            setStatusMessage({
                type: 'error',
                text: error.message || 'Failed to create profile.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
            onClick={onClose}
        >
            <div 
                className='bg-[#1c1c1c] border border-gray-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className='p-5 border-b border-gray-800 flex items-center justify-between bg-[#222222]'>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/60 flex items-center justify-center text-lg'>
                            👤
                        </div>
                        <div>
                            <h2 className='text-lg font-bold text-white'>Add New Employee & Role</h2>
                            <p className='text-xs text-gray-400'>Create employee credentials and place in organization hierarchy</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className='w-8 h-8 rounded-full bg-gray-800 hover:bg-rose-600 hover:text-white transition-colors text-gray-400 flex items-center justify-center text-sm'
                    >
                        ✕
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className='p-6 space-y-4 overflow-y-auto'>
                    {statusMessage && (
                        <div className={`p-3 rounded-lg text-xs font-semibold ${
                            statusMessage.type === 'success'
                                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                                : 'bg-rose-950/80 border border-rose-500 text-rose-300'
                        }`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1'>
                                First Name <span className='text-rose-400'>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="e.g. Rohit"
                                className='w-full px-3.5 py-2 bg-black/40 border border-gray-700 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-colors'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-medium text-gray-300 mb-1'>
                                Email Address <span className='text-rose-400'>*</span>
                            </label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="e.g. rohit@example.com"
                                className='w-full px-3.5 py-2 bg-black/40 border border-gray-700 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-colors'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-xs font-medium text-gray-300 mb-1'>
                            Password <span className='text-rose-400'>*</span>
                        </label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="e.g. 123"
                            className='w-full px-3.5 py-2 bg-black/40 border border-gray-700 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-gray-500 outline-none transition-colors'
                        />
                    </div>

                    {/* Hierarchy & Role Details */}
                    <div className='p-3 bg-black/30 border border-gray-800 rounded-xl space-y-3'>
                        <h4 className='text-xs font-bold text-purple-300 flex items-center gap-1.5'>
                            <span>🌳</span>
                            <span>Hierarchy & Department Assignment</span>
                        </h4>

                        <div>
                            <label className='block text-[11px] font-medium text-gray-300 mb-1'>
                                Job Title / Designation <span className='text-rose-400'>*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                placeholder="e.g. Lead Frontend Architect"
                                className='w-full px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 focus:border-purple-500 rounded-xl text-xs text-white outline-none'
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                            <div>
                                <label className='block text-[11px] font-medium text-gray-300 mb-1'>
                                    Department
                                </label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className='w-full px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-xs text-white outline-none focus:border-purple-500'
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Design">Product & Design</option>
                                    <option value="DevOps">DevOps & Cloud</option>
                                    <option value="QA">Quality Assurance (QA)</option>
                                    <option value="Product">Product Management</option>
                                    <option value="Marketing">Marketing & Growth</option>
                                    <option value="Operations">Operations</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-[11px] font-medium text-gray-300 mb-1'>
                                    Hierarchy Layer Level
                                </label>
                                <select
                                    value={hierarchyLevel}
                                    onChange={(e) => setHierarchyLevel(Number(e.target.value))}
                                    className='w-full px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-xs text-white outline-none focus:border-purple-500'
                                >
                                    <option value="2">Layer 2: Management & Team Leads</option>
                                    <option value="3">Layer 3: Senior Specialists & Engineers</option>
                                    <option value="4">Layer 4: Associates & Junior Engineers</option>
                                    <option value="5">Layer 5: Interns & Trainees</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className='block text-[11px] font-medium text-gray-300 mb-1'>
                                Reporting Manager (Reports To)
                            </label>
                            <select
                                value={reportsTo}
                                onChange={(e) => setReportsTo(e.target.value)}
                                className='w-full px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-xs text-white outline-none focus:border-purple-500'
                            >
                                <option value="Admin">Admin (Executive Leadership)</option>
                                {(userData || []).map((emp) => (
                                    <option key={emp.id || emp.firstName} value={emp.firstName}>
                                        {emp.firstName} ({emp.designation || 'Team Member'} - Layer {emp.hierarchyLevel || 3})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className='pt-2 flex gap-3'>
                        <button
                            type="button"
                            onClick={onClose}
                            className='flex-1 py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className='flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-colors shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-1.5'
                        >
                            {loading ? 'Creating...' : 'Create Employee Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEmployeeModal;
