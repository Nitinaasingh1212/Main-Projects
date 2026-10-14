import React from 'react';

const TopNavbar = ({
    title,
    currentUser,
    onLogout,
    onQuickSwitchUser,
    isCloudSynced = false
}) => {
    return (
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10">
            {/* Left: View Title & Current Scope */}
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-800">
                    {title || 'Dashboard'}
                </h1>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold border border-slate-200">
                        🏢 {currentUser?.organizationName || 'TeamWork HQ'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{currentUser?.department || 'Operations'}</span>
                </span>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-3">
                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 pl-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-sm font-bold border border-slate-200">
                        {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-slate-800 leading-none">
                            {currentUser?.name || 'User'}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                            {currentUser?.position}
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    title="Log Out"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default TopNavbar;
