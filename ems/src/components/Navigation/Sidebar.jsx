import React, { useState } from 'react';

const Sidebar = ({
    activeNav,
    setActiveNav,
    onLogout,
    currentUser,
    onQuickSwitchUser,
    onOpenCreateTask
}) => {
    const role = currentUser?.role || 'user';

    // Role-specific nav items
    let navItems = [];

    if (role === 'main_admin') {
        navItems = [
            {
                id: 'dashboard',
                label: 'Dashboard',
                badge: 'Overview',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            },
            {
                id: 'users',
                label: 'Team Members',
                badge: 'Directory',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )
            },
            {
                id: 'secondary_admins',
                label: 'Secondary Admins',
                badge: 'Max 2',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                )
            },
            {
                id: 'tasks',
                label: 'All Work Board',
                badge: 'Kanban',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                )
            },
            {
                id: 'positions_depts',
                label: 'Positions & Depts',
                badge: 'Dynamic',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                )
            }
        ];
    } else if (role === 'secondary_admin') {
        navItems = [
            {
                id: 'dashboard',
                label: 'Team Overview',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            },
            {
                id: 'users',
                label: 'Managed Members',
                badge: currentUser?.department || 'Scope',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                )
            },
            {
                id: 'tasks',
                label: 'Assigned Work',
                badge: 'Review',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                )
            }
        ];
    } else {
        // Normal User
        navItems = [
            {
                id: 'dashboard',
                label: 'My Dashboard',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                )
            },
            {
                id: 'tasks',
                label: 'My Tasks',
                badge: 'Only Mine',
                icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                )
            }
        ];
    }

    return (
        <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between flex-shrink-0 z-20">
            <div>
                {/* Brand Logo Header */}
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div
                        onClick={() => setActiveNav('dashboard')}
                        className="flex items-center gap-2.5 cursor-pointer select-none group"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0084ff] to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/20 text-white font-extrabold text-lg group-hover:scale-105 transition-transform">
                            TW
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xl font-extrabold tracking-tight text-[#0084ff] leading-tight">
                                TEAMWORK
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold tracking-tight truncate max-w-[140px]" title={currentUser?.organizationName || 'TeamWork HQ'}>
                                🏢 {currentUser?.organizationName || 'TeamWork HQ'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Action Button */}
                <div className="px-4 pt-5 pb-2">
                    <button
                        onClick={onOpenCreateTask}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0084ff] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2"
                    >
                        <span>+</span>
                        <span>{role === 'user' ? 'Add Personal Task' : 'Assign Work'}</span>
                    </button>
                </div>

                {/* Primary Navigation Section */}
                <div className="py-3">
                    <p className="px-6 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {role === 'main_admin' ? 'Administration' : role === 'secondary_admin' ? 'Management' : 'My Workspace'}
                    </p>
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = activeNav === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 relative ${
                                        isActive
                                            ? 'bg-sky-50 text-[#0084ff] font-bold'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={isActive ? 'text-[#0084ff]' : 'text-slate-400'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && !isActive && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && (
                                        <div className="w-1.5 h-5 bg-[#0084ff] rounded-full absolute right-2"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Strict Role Privacy Banner (Section 15) */}
                <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <span>🔒</span>
                        <span>Private & Scoped</span>
                    </div>
                    {role === 'main_admin' && 'Complete visibility over all users and team work.'}
                    {role === 'secondary_admin' && 'Scoped visibility to users in your department.'}
                    {role === 'user' && 'You can ONLY view and manage your own work.'}
                </div>
            </div>

            {/* Bottom Current User */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/70 shadow-sm">
                    <div 
                        className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2"
                    >
                        <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0084ff] flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                            {currentUser?.avatar || currentUser?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate group-hover:text-[#0084ff] transition-colors">
                                {currentUser?.name || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                                {currentUser?.roleLabel || currentUser?.position || 'Role'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        title="Sign Out"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
