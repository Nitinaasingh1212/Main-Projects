import React, { useEffect, useState } from 'react';
import Login from './components/Auth/Login';
import Sidebar from './components/Navigation/Sidebar';
import TopNavbar from './components/Navigation/TopNavbar';
import AdminDashboardView from './components/Dashboard/AdminDashboardView';
import UserDashboardView from './components/Dashboard/UserDashboardView';
import AdminUsersView from './components/Users/AdminUsersView';
import SecondaryAdminView from './components/SecondaryAdmin/SecondaryAdminView';
import AllWorkView from './components/Work/AllWorkView';
import CreateTaskModal from './components/Work/CreateTaskModal';
import TaskDetailsModal from './components/Work/TaskDetailsModal';
import PositionsDepartmentsView from './components/Settings/PositionsDepartmentsView';

import {
    initializeTeamWorkStorage,
    authenticateUser,
    registerAdmin,
    registerUser,
    resetWorkspaceToScratch,
    getWorkspaces,
    getTasksForCurrentUser,
    getUsersForCurrentUser,
    getSecondaryAdmins,
    getAllUsers,
    getPositions,
    getDepartments,
    createTask,
    updateTaskWorkflowStatus,
    deleteTask,
    toggleTaskChecklist,
    addTaskChecklistItem,
    addTaskComment,
    addTaskAttachment,
    deleteTaskAttachment,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    addSecondaryAdmin,
    updateSecondaryAdmin,
    deleteSecondaryAdmin,
    addPosition,
    addDepartment,
    applyTemplatePreset,
    syncTeamWorkWithFirestore
} from './services/teamworkService';

const App = () => {
    // Current authenticated user
    const [currentUser, setCurrentUser] = useState(null);
    const [activeNav, setActiveNav] = useState('dashboard');
    const [isCloudSynced, setIsCloudSynced] = useState(false);

    // Data collections
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [secondaryAdmins, setSecondaryAdmins] = useState([]);
    const [positions, setPositions] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Modals
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [prefilledUserForTask, setPrefilledUserForTask] = useState(null);
    const [inspectedTask, setInspectedTask] = useState(null);

    // Toast notification
    const [toast, setToast] = useState(null);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3500);
    };

    // Load active session from localStorage & initialize real-time Firestore sync
    useEffect(() => {
        initializeTeamWorkStorage();
        const savedSession = localStorage.getItem('tw_active_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                setCurrentUser(parsed);
            } catch (e) {
                localStorage.removeItem('tw_active_session');
            }
        }

        const unsub = syncTeamWorkWithFirestore(() => {
            setIsCloudSynced(true);
            refreshData();
        });

        return () => {
            if (unsub) unsub();
        };
    }, []);

    // Refresh data whenever currentUser changes or mutations occur
    const refreshData = () => {
        if (!currentUser) return;
        const currentTasks = getTasksForCurrentUser(currentUser);
        setTasks(currentTasks);

        const currentUsers = getUsersForCurrentUser(currentUser);
        setUsers(currentUsers);

        setSecondaryAdmins(getSecondaryAdmins(currentUser));
        setPositions(getPositions());
        setDepartments(getDepartments(currentUser));

        // Update inspected task if open
        if (inspectedTask) {
            const updatedInspected = currentTasks.find(t => t.id === inspectedTask.id);
            if (updatedInspected) setInspectedTask(updatedInspected);
        }
    };

    useEffect(() => {
        refreshData();
    }, [currentUser]);

    // Handlers
    const handleLogin = (email, password) => {
        const auth = authenticateUser(email, password);
        if (auth && auth.user) {
            setCurrentUser(auth.user);
            localStorage.setItem('tw_active_session', JSON.stringify(auth.user));
            setActiveNav('dashboard');
            showToast(`Welcome back, ${auth.user.name}!`);
        } else {
            alert('Invalid credentials. Please select one of the demo accounts or sign up.');
        }
    };

    const handleSignUpAdmin = (adminData) => {
        try {
            const auth = registerAdmin(adminData);
            if (auth && auth.user) {
                setCurrentUser(auth.user);
                localStorage.setItem('tw_active_session', JSON.stringify(auth.user));
                setActiveNav('dashboard');
                showToast(`🎉 Workspace "${auth.user.organizationName}" created from scratch! Welcome, ${auth.user.name}.`);
            }
        } catch (err) {
            alert(err.message || 'Error creating admin account.');
        }
    };

    const handleSignUpUser = (userData) => {
        try {
            const auth = registerUser(userData);
            if (auth && auth.user) {
                setCurrentUser(auth.user);
                localStorage.setItem('tw_active_session', JSON.stringify(auth.user));
                setActiveNav('dashboard');
                showToast(`🎉 Welcome to ${auth.user.organizationName}, ${auth.user.name}!`);
            }
        } catch (err) {
            alert(err.message || 'Error creating user account.');
        }
    };

    const handleResetToScratch = () => {
        if (window.confirm("Are you sure you want to start from scratch? This will clear all tasks and members in your active workspace so you can build your real team from scratch.")) {
            const res = resetWorkspaceToScratch(currentUser);
            refreshData();
            showToast(res.message);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('tw_active_session');
        setActiveNav('dashboard');
    };

    const handleQuickSwitchUser = (email) => {
        const auth = authenticateUser(email, '123');
        if (auth && auth.user) {
            setCurrentUser(auth.user);
            localStorage.setItem('tw_active_session', JSON.stringify(auth.user));
            setActiveNav('dashboard');
            showToast(`Switched account to: ${auth.user.name} (${auth.roleLabel})`);
        }
    };

    // Task workflow operations
    const handleStatusChange = (taskId, newStatus, feedbackOrNotes = '') => {
        try {
            updateTaskWorkflowStatus(taskId, newStatus, currentUser, feedbackOrNotes);
            refreshData();
            showToast(`Work status updated to: ${newStatus.replace('_', ' ')}`);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCreateTask = (taskData) => {
        createTask(taskData, currentUser);
        refreshData();
        showToast(`Work item successfully assigned!`);
    };

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
        refreshData();
        showToast('Task removed from board.');
    };

    const handleToggleChecklist = (taskId, checklistItemId) => {
        toggleTaskChecklist(taskId, checklistItemId);
        refreshData();
    };

    const handleAddChecklistItem = (taskId, text) => {
        addTaskChecklistItem(taskId, text);
        refreshData();
    };

    const handleAddComment = (taskId, authorName, authorRole, text) => {
        addTaskComment(taskId, authorName, authorRole, text);
        refreshData();
    };

    const handleAddAttachment = (taskId, attachmentOrName, size, uploadedBy) => {
        addTaskAttachment(taskId, attachmentOrName, size, uploadedBy);
        refreshData();
    };

    const handleDeleteAttachment = (taskId, attachmentId) => {
        deleteTaskAttachment(taskId, attachmentId);
        refreshData();
        showToast('Attachment removed.');
    };

    // User management
    const handleAddUser = (userData) => {
        addUser(userData, currentUser);
        refreshData();
        showToast(`User ${userData.name} created successfully!`);
    };

    const handleUpdateUser = (userId, userData) => {
        updateUser(userId, userData);
        refreshData();
        showToast(`User profile updated.`);
    };

    const handleToggleUserStatus = (userId) => {
        toggleUserStatus(userId);
        refreshData();
    };

    const handleDeleteUser = (userId) => {
        deleteUser(userId);
        refreshData();
        showToast(`User deleted.`);
    };

    // Secondary Admin management
    const handleAddSecondaryAdmin = (adminData) => {
        try {
            addSecondaryAdmin(adminData, currentUser);
            refreshData();
            showToast(`Secondary Admin ${adminData.name} added.`);
        } catch (e) {
            alert(e.message);
        }
    };

    const handleUpdateSecondaryAdmin = (id, adminData) => {
        updateSecondaryAdmin(id, adminData);
        refreshData();
        showToast(`Secondary Admin permissions updated.`);
    };

    const handleDeleteSecondaryAdmin = (id) => {
        deleteSecondaryAdmin(id);
        refreshData();
        showToast(`Secondary Admin removed.`);
    };

    // Settings
    const handleAddPosition = (posName) => {
        addPosition(posName);
        refreshData();
        showToast(`Position added: ${posName}`);
    };

    const handleAddDepartment = (deptData) => {
        addDepartment(deptData, currentUser);
        refreshData();
        showToast(`Department added: ${deptData.name}`);
    };

    const handleSwitchPreset = (presetType) => {
        const res = applyTemplatePreset(presetType);
        refreshData();
        showToast(res.message);
    };

    // If not logged in, render Login
    if (!currentUser) {
        return (
            <Login
                handleLogin={handleLogin}
                handleSignUpAdmin={handleSignUpAdmin}
                handleSignUpUser={handleSignUpUser}
            />
        );
    }

    const isAdmin = currentUser.role === 'main_admin';
    const isSecondaryAdmin = currentUser.role === 'secondary_admin';
    const isUser = currentUser.role === 'user';

    const getPageTitle = () => {
        switch (activeNav) {
            case 'dashboard':
                return isUser ? 'My Dashboard' : 'Leadership Dashboard';
            case 'users':
                return 'Team Members & User Directory';
            case 'secondary_admins':
                return 'Secondary Admin Management';
            case 'tasks':
                return isUser ? 'My Assigned Work' : 'Central Work Board';
            case 'positions_depts':
                return 'Dynamic Positions & Departments';
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f4f7fb] text-slate-800 antialiased font-sans">
            {/* Sidebar Navigation */}
            <Sidebar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onLogout={handleLogout}
                currentUser={currentUser}
                onQuickSwitchUser={handleQuickSwitchUser}
                onOpenCreateTask={() => {
                    setPrefilledUserForTask(null);
                    setShowCreateTaskModal(true);
                }}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <TopNavbar
                    title={getPageTitle()}
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onQuickSwitchUser={handleQuickSwitchUser}
                    isCloudSynced={isCloudSynced}
                />

                <main className="flex-1 pb-16">
                    {/* View 1: Dashboard */}
                    {activeNav === 'dashboard' && (
                        <>
                            {isUser ? (
                                <UserDashboardView
                                    currentUser={currentUser}
                                    tasks={tasks}
                                    onStatusChange={handleStatusChange}
                                    onTaskClick={(t) => setInspectedTask(t)}
                                    onAddPersonalTask={() => {
                                        setPrefilledUserForTask(currentUser);
                                        setShowCreateTaskModal(true);
                                    }}
                                />
                            ) : (
                                <AdminDashboardView
                                    currentUser={currentUser}
                                    users={users}
                                    secondaryAdmins={secondaryAdmins}
                                    tasks={tasks}
                                    onNavigate={(nav) => setActiveNav(nav)}
                                    onAssignTask={(user) => {
                                        setPrefilledUserForTask(user);
                                        setShowCreateTaskModal(true);
                                    }}
                                    onTaskClick={(t) => setInspectedTask(t)}
                                    onSwitchPreset={handleSwitchPreset}
                                    onResetToScratch={handleResetToScratch}
                                />
                            )}
                        </>
                    )}

                    {/* View 2: Users Management (Admin & Secondary Admin) */}
                    {activeNav === 'users' && !isUser && (
                        <AdminUsersView
                            users={users}
                            tasks={tasks}
                            positions={positions}
                            departments={departments}
                            onAddUser={handleAddUser}
                            onUpdateUser={handleUpdateUser}
                            onToggleStatus={handleToggleUserStatus}
                            onDeleteUser={handleDeleteUser}
                            onAssignTask={(u) => {
                                setPrefilledUserForTask(u);
                                setShowCreateTaskModal(true);
                            }}
                            onTaskClick={(t) => setInspectedTask(t)}
                        />
                    )}

                    {/* View 3: Secondary Admin Management (Main Admin only) */}
                    {activeNav === 'secondary_admins' && isAdmin && (
                        <SecondaryAdminView
                            secondaryAdmins={secondaryAdmins}
                            departments={departments}
                            positions={positions}
                            onAddSecondaryAdmin={handleAddSecondaryAdmin}
                            onUpdateSecondaryAdmin={handleUpdateSecondaryAdmin}
                            onDeleteSecondaryAdmin={handleDeleteSecondaryAdmin}
                        />
                    )}

                    {/* View 4: Tasks / Work Board */}
                    {activeNav === 'tasks' && (
                        <AllWorkView
                            tasks={tasks}
                            users={users}
                            currentUser={currentUser}
                            onStatusChange={handleStatusChange}
                            onTaskClick={(t) => setInspectedTask(t)}
                            onAddNewTask={() => {
                                setPrefilledUserForTask(isUser ? currentUser : null);
                                setShowCreateTaskModal(true);
                            }}
                        />
                    )}

                    {/* View 5: Positions & Departments (Main Admin only) */}
                    {activeNav === 'positions_depts' && isAdmin && (
                        <PositionsDepartmentsView
                            positions={positions}
                            departments={departments}
                            onAddPosition={handleAddPosition}
                            onAddDepartment={handleAddDepartment}
                            onSwitchPreset={handleSwitchPreset}
                            onResetToScratch={handleResetToScratch}
                        />
                    )}
                </main>
            </div>

            {/* Create Task Modal */}
            {showCreateTaskModal && (
                <CreateTaskModal
                    users={users}
                    currentUser={currentUser}
                    prefilledUser={prefilledUserForTask}
                    onClose={() => {
                        setShowCreateTaskModal(false);
                        setPrefilledUserForTask(null);
                    }}
                    onSubmitSuccess={handleCreateTask}
                />
            )}

            {/* Task Details Modal */}
            {inspectedTask && (
                <TaskDetailsModal
                    task={inspectedTask}
                    currentUser={currentUser}
                    onClose={() => setInspectedTask(null)}
                    onStatusChange={handleStatusChange}
                    onToggleChecklist={handleToggleChecklist}
                    onAddChecklistItem={handleAddChecklistItem}
                    onAddComment={handleAddComment}
                    onAddAttachment={handleAddAttachment}
                    onDeleteAttachment={handleDeleteAttachment}
                    onDeleteTask={handleDeleteTask}
                />
            )}

            {/* Global Toast Alert */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default App;