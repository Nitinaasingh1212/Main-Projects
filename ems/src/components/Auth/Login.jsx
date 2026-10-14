import React, { useState, useEffect } from 'react';
import { getWorkspaces } from '../../services/teamworkService';

const Login = ({ handleLogin, handleSignUpAdmin, handleSignUpUser }) => {
    // Auth mode: 'signin' | 'signup'
    const [authMode, setAuthMode] = useState('signin');
    
    // Sign In state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

    // Sign Up state
    // roleType: 'admin' | 'user'
    const [roleType, setRoleType] = useState('admin');
    
    // Admin fields
    const [adminName, setAdminName] = useState('');
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminPhone, setAdminPhone] = useState('');
    const [orgName, setOrgName] = useState('');
    const [adminPosition, setAdminPosition] = useState('Dean / Project Lead');
    const [adminDept, setAdminDept] = useState('Executive Leadership');
    const [setupMode, setSetupMode] = useState('scratch'); // 'scratch' | 'university' | 'hackathon'
    const [showAdminPassword, setShowAdminPassword] = useState(false);

    // User fields
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('');
    const [userPosition, setUserPosition] = useState('Frontend Developer');
    const [userDept, setUserDept] = useState('Computer Science');
    const [showUserPassword, setShowUserPassword] = useState(false);

    const [isSubmittingSignUp, setIsSubmittingSignUp] = useState(false);
    const [workspaces, setWorkspaces] = useState([]);

    useEffect(() => {
        const wsList = getWorkspaces();
        setWorkspaces(wsList);
        if (wsList.length > 0) {
            setSelectedWorkspaceId(wsList[0].id);
        }
    }, [authMode]);

    // Handle Login Submit
    const onLoginSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingLogin(true);
        try {
            await handleLogin(loginEmail, loginPassword);
        } finally {
            setIsSubmittingLogin(false);
        }
    };

    // Handle Sign Up Submit
    const onSignUpSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingSignUp(true);
        try {
            if (roleType === 'admin') {
                if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim() || !orgName.trim()) {
                    alert('Please complete all required fields for your Admin account and Organization.');
                    return;
                }
                if (handleSignUpAdmin) {
                    await handleSignUpAdmin({
                        name: adminName.trim(),
                        email: adminEmail.trim(),
                        password: adminPassword.trim(),
                        phone: adminPhone.trim(),
                        organizationName: orgName.trim(),
                        position: adminPosition.trim(),
                        department: adminDept.trim(),
                        setupMode
                    });
                }
            } else {
                if (!userName.trim() || !userEmail.trim() || !userPassword.trim() || !selectedWorkspaceId) {
                    alert('Please complete all required fields and select an organization to join.');
                    return;
                }
                if (handleSignUpUser) {
                    await handleSignUpUser({
                        name: userName.trim(),
                        email: userEmail.trim(),
                        password: userPassword.trim(),
                        phone: userPhone.trim(),
                        workspaceId: selectedWorkspaceId,
                        department: userDept.trim(),
                        position: userPosition.trim()
                    });
                }
            }
        } finally {
            setIsSubmittingSignUp(false);
        }
    };


    return (
        <div className="flex min-h-screen w-screen items-center justify-center p-4 sm:p-6 bg-[#f4f7fb]">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 w-full max-w-xl shadow-xl card-shadow-lg transition-all">
                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0084ff] to-blue-600 mx-auto flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-extrabold text-2xl mb-3">
                        TW
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        TEAMWORK <span className="text-[#0084ff]">PORTAL</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium max-w-sm mx-auto">
                        Admin Governance → Strict Task Privacy → Scalable Workflows
                    </p>
                </div>

                {/* Mode Switcher Tabs: Sign In vs Sign Up */}
                <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200 text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            authMode === 'signin'
                                ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <span>🔑</span>
                        <span>Sign In</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                            authMode === 'signup'
                                ? 'bg-white text-[#0084ff] shadow-sm font-extrabold'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <span>✨</span>
                        <span>Create Account / Sign Up</span>
                    </button>
                </div>

                {/* ========================================================================= */}
                {/* TAB 1: SIGN IN FORM */}
                {/* ========================================================================= */}
                {authMode === 'signin' && (
                    <div>
                        {/* Role Structure Badge */}
                        <div className="mb-5 p-3 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-around text-center text-xs">
                            <div>
                                <span className="block font-extrabold text-amber-600">👑 MAIN ADMIN</span>
                                <span className="text-[10px] text-slate-400">Total Control</span>
                            </div>
                            <span className="text-slate-300">→</span>
                            <div>
                                <span className="block font-extrabold text-purple-600">🛡️ SEC ADMIN</span>
                                <span className="text-[10px] text-slate-400">Max 2 Scope</span>
                            </div>
                            <span className="text-slate-300">→</span>
                            <div>
                                <span className="block font-extrabold text-[#0084ff]">👤 USERS</span>
                                <span className="text-[10px] text-slate-400">Private Tasks</span>
                            </div>
                        </div>

                        {/* Sign In Form */}
                        <form onSubmit={onLoginSubmit} className="flex flex-col space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Account Email Address
                                </label>
                                <input
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                    className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2.5 px-3.5 rounded-xl placeholder:text-slate-400 transition-colors"
                                    type="email"
                                    placeholder="admin@teamwork.com or user@teamwork.com"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-slate-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="text-[11px] text-[#0084ff] hover:underline font-semibold"
                                    >
                                        {showLoginPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                    className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2.5 px-3.5 rounded-xl placeholder:text-slate-400 transition-colors"
                                    type={showLoginPassword ? "text" : "password"}
                                    placeholder="Enter password (default: 123)"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingLogin}
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0084ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md shadow-sky-500/20 cursor-pointer mt-2"
                            >
                                {isSubmittingLogin ? 'Authenticating...' : 'Sign In to Portal'}
                            </button>
                        </form>

                        {/* Sign up prompt */}
                        <div className="mt-4 text-center">
                            <span className="text-xs text-slate-500">Want to launch your own organization? </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMode('signup');
                                    setRoleType('admin');
                                }}
                                className="text-xs font-bold text-[#0084ff] hover:underline"
                            >
                                Create New Admin from Scratch →
                            </button>
                        </div>
                    </div>
                )}

                {/* ========================================================================= */}
                {/* TAB 2: SIGN UP FORM (NEW ADMIN FROM SCRATCH OR NEW USER) */}
                {/* ========================================================================= */}
                {authMode === 'signup' && (
                    <div>
                        {/* Account Type Selector */}
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-slate-700 mb-2">
                                I am registering as:
                            </label>
                            <div className="grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setRoleType('admin')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        roleType === 'admin'
                                            ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/30'
                                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg">👑</span>
                                        {roleType === 'admin' && (
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <span className="block font-extrabold text-xs text-amber-900">
                                            New Main Admin
                                        </span>
                                        <span className="text-[10px] text-amber-700 block mt-0.5">
                                            Make from Scratch
                                        </span>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setRoleType('user')}
                                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                                        roleType === 'user'
                                            ? 'bg-sky-50/70 border-sky-300 ring-2 ring-sky-400/30'
                                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg">👤</span>
                                        {roleType === 'user' && (
                                            <span className="w-2 h-2 rounded-full bg-[#0084ff]"></span>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <span className="block font-extrabold text-xs text-slate-900">
                                            Team Member
                                        </span>
                                        <span className="text-[10px] text-slate-500 block mt-0.5">
                                            Join an Organization
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Sign Up Form */}
                        <form onSubmit={onSignUpSubmit} className="flex flex-col space-y-3.5">
                            {/* --- ROLE: NEW ADMIN (MAKE FROM SCRATCH) --- */}
                            {roleType === 'admin' && (
                                <>
                                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] leading-relaxed">
                                        <strong>👑 New Admin Setup:</strong> Register your organization and build your workspace from scratch. You will have 100% control over team members, secondary admins, departments, and task delegations.
                                    </div>

                                    {/* Organization / Company / University Name */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Organization / Company / Institution Name *
                                        </label>
                                        <input
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            required
                                            className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                            type="text"
                                            placeholder="e.g. Apex Innovations, Stanford CS Lab, or Team Alpha"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Admin Name */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Admin Full Name *
                                            </label>
                                            <input
                                                value={adminName}
                                                onChange={(e) => setAdminName(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Dr. Nitin Singh"
                                            />
                                        </div>

                                        {/* Admin Email */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Admin Work Email *
                                            </label>
                                            <input
                                                value={adminEmail}
                                                onChange={(e) => setAdminEmail(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="email"
                                                placeholder="e.g. admin@yourorg.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Password */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Password *
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                                                    className="text-[10px] text-[#0084ff] font-semibold"
                                                >
                                                    {showAdminPassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                            <input
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type={showAdminPassword ? "text" : "password"}
                                                placeholder="Create password"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Contact Phone (Optional)
                                            </label>
                                            <input
                                                value={adminPhone}
                                                onChange={(e) => setAdminPhone(e.target.value)}
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="tel"
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Leadership Title */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Your Leadership Title
                                            </label>
                                            <input
                                                value={adminPosition}
                                                onChange={(e) => setAdminPosition(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Dean / CEO / Project Director"
                                            />
                                        </div>

                                        {/* Primary Department */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Primary Department
                                            </label>
                                            <input
                                                value={adminDept}
                                                onChange={(e) => setAdminDept(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Executive Leadership or Engineering"
                                            />
                                        </div>
                                    </div>

                                    {/* Workspace Initialization Setup Mode */}
                                    <div className="pt-2">
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Select Workspace Initial State:
                                        </label>
                                        <div className="space-y-2">
                                            {/* Option 1: Completely from scratch */}
                                            <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                                setupMode === 'scratch'
                                                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                                                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="setupMode"
                                                    value="scratch"
                                                    checked={setupMode === 'scratch'}
                                                    onChange={() => setSetupMode('scratch')}
                                                    className="mt-0.5"
                                                />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-xs text-slate-800">
                                                            🌟 Start from Scratch (Clean Slate)
                                                        </span>
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            RECOMMENDED
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                                        Zero tasks, zero users. A clean slate so you can build your real team and deliverables from scratch.
                                                    </p>
                                                </div>
                                            </label>

                                            {/* Option 2: University Preset */}
                                            <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                                setupMode === 'university'
                                                    ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-300'
                                                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="setupMode"
                                                    value="university"
                                                    checked={setupMode === 'university'}
                                                    onChange={() => setSetupMode('university')}
                                                    className="mt-0.5"
                                                />
                                                <div>
                                                    <span className="font-extrabold text-xs text-slate-800">
                                                        🎓 University & Academic Mode
                                                    </span>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                                        Pre-configured with Dean, HOD, Professor, Student positions and academic department codes.
                                                    </p>
                                                </div>
                                            </label>

                                            {/* Option 3: Hackathon Preset */}
                                            <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                                setupMode === 'hackathon'
                                                    ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-300'
                                                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="setupMode"
                                                    value="hackathon"
                                                    checked={setupMode === 'hackathon'}
                                                    onChange={() => setSetupMode('hackathon')}
                                                    className="mt-0.5"
                                                />
                                                <div>
                                                    <span className="font-extrabold text-xs text-slate-800">
                                                        🚀 Tech & Hackathon Mode
                                                    </span>
                                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                                        Pre-configured with Project Lead, Devs, Designers, ML Engineer roles & agile teams.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingSignUp}
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md shadow-orange-500/20 cursor-pointer mt-3"
                                    >
                                        {isSubmittingSignUp ? 'Initializing Workspace...' : '👑 Create Admin Account & Launch Workspace'}
                                    </button>
                                </>
                            )}

                            {/* --- ROLE: TEAM MEMBER / USER --- */}
                            {roleType === 'user' && (
                                <>
                                    <div className="p-3 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-800 text-[11px] leading-relaxed">
                                        <strong>👤 Team Member Registration:</strong> Select the organization you are part of, choose your department, and sign up. You will only see and manage work items assigned directly to you.
                                    </div>

                                    {/* Organization selector */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Select Organization / Workspace to Join *
                                        </label>
                                        <select
                                            value={selectedWorkspaceId}
                                            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                                            required
                                            className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
                                        >
                                            {workspaces.map((ws) => (
                                                <option key={ws.id} value={ws.id}>
                                                    🏢 {ws.name} ({ws.code}) — Admin: {ws.adminName || 'Admin'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* User Name */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Full Name *
                                            </label>
                                            <input
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Rahul Sharma"
                                            />
                                        </div>

                                        {/* User Email */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Work Email *
                                            </label>
                                            <input
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="email"
                                                placeholder="e.g. rahul@yourorg.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Password */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Password *
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowUserPassword(!showUserPassword)}
                                                    className="text-[10px] text-[#0084ff] font-semibold"
                                                >
                                                    {showUserPassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                            <input
                                                value={userPassword}
                                                onChange={(e) => setUserPassword(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type={showUserPassword ? "text" : "password"}
                                                placeholder="Enter password"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                value={userPhone}
                                                onChange={(e) => setUserPhone(e.target.value)}
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="tel"
                                                placeholder="+91 9876500001"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Position */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Position / Role *
                                            </label>
                                            <input
                                                value={userPosition}
                                                onChange={(e) => setUserPosition(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Frontend Developer or Student"
                                            />
                                        </div>

                                        {/* Department */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Department *
                                            </label>
                                            <input
                                                value={userDept}
                                                onChange={(e) => setUserDept(e.target.value)}
                                                required
                                                className="w-full outline-none bg-slate-50 border border-slate-200 focus:border-[#0084ff] focus:bg-white text-slate-800 font-medium text-xs py-2 px-3 rounded-xl placeholder:text-slate-400 transition-colors"
                                                type="text"
                                                placeholder="e.g. Computer Science"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmittingSignUp}
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0084ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md shadow-sky-500/20 cursor-pointer mt-3"
                                    >
                                        {isSubmittingSignUp ? 'Creating Account...' : '👤 Join Team & Sign In'}
                                    </button>
                                </>
                            )}
                        </form>

                        {/* Back to sign in */}
                        <div className="mt-4 text-center">
                            <span className="text-xs text-slate-500">Already registered? </span>
                            <button
                                type="button"
                                onClick={() => setAuthMode('signin')}
                                className="text-xs font-bold text-[#0084ff] hover:underline"
                            >
                                Back to Sign In →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;