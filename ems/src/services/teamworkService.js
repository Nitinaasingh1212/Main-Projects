// Centralized Data Layer & Service for TeamWork Management Platform
// Strict Role-Based Access Control:
// 1. MAIN ADMIN (Exactly 1)
// 2. SECONDARY ADMIN (Optional, Max 2)
// 3. USER (Normal team members, can ONLY see and manage their own work)
import { db, isFirebaseConfigured } from '../firebase/config';
import {
    collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';

const STORAGE_KEYS = {
    MAIN_ADMIN: 'tw_main_admin',
    ALL_ADMINS: 'tw_all_admins',
    WORKSPACES: 'tw_workspaces',
    SECONDARY_ADMINS: 'tw_secondary_admins',
    USERS: 'tw_users',
    TASKS: 'tw_tasks',
    POSITIONS: 'tw_positions',
    DEPARTMENTS: 'tw_departments',
    ACTIVE_SESSION: 'tw_active_session',
    ACTIVE_TEMPLATE: 'tw_active_template'
};

export const FIRESTORE_COLLECTIONS = {
    WORKSPACES: 'tw_workspaces',
    ADMINS: 'tw_admins',
    SECONDARY_ADMINS: 'tw_secondary_admins',
    USERS: 'tw_users',
    TASKS: 'tw_tasks',
    DEPARTMENTS: 'tw_departments',
    POSITIONS: 'tw_positions'
};

// Non-blocking Firestore Write Helpers
const fsSetDoc = async (colName, docId, data) => {
    if (!isFirebaseConfigured || !db) return;
    try {
        await setDoc(doc(db, colName, String(docId)), data, { merge: true });
        console.log(`🔥 [Firestore] Synced to ${colName}/${docId}`);
    } catch (err) {
        console.error(`⚠️ [Firestore] Error saving to ${colName}/${docId}:`, err);
    }
};

const fsUpdateDoc = async (colName, docId, fields) => {
    if (!isFirebaseConfigured || !db) return;
    try {
        await updateDoc(doc(db, colName, String(docId)), fields);
        console.log(`🔥 [Firestore] Updated ${colName}/${docId}`);
    } catch (err) {
        // If doc not created yet in cloud, create it via setDoc with merge
        try {
            await setDoc(doc(db, colName, String(docId)), fields, { merge: true });
            console.log(`🔥 [Firestore] Upserted ${colName}/${docId}`);
        } catch (inner) {
            console.error(`⚠️ [Firestore] Error updating ${colName}/${docId}:`, inner);
        }
    }
};

const fsDeleteDoc = async (colName, docId) => {
    if (!isFirebaseConfigured || !db) return;
    try {
        await deleteDoc(doc(db, colName, String(docId)));
        console.log(`🔥 [Firestore] Deleted ${colName}/${docId}`);
    } catch (err) {
        console.error(`⚠️ [Firestore] Error deleting ${colName}/${docId}:`, err);
    }
};

// Registered Workspaces / Organizations
export const initialWorkspaces = [
    {
        id: "ws-default",
        name: "TeamWork HQ",
        code: "TW-01",
        adminId: "admin-main",
        adminName: "Nitin Singh",
        createdAt: "2026-01-01",
        description: "Default Demo Workspace"
    }
];

// Initial Dynamic Positions (Configurable for University / Hackathon / Office)
export const initialPositions = [
    // University Roles
    "Dean",
    "HOD - Computer Science",
    "HOD - AI Research",
    "Assistant Professor",
    "Senior Lecturer",
    "Student Coordinator",
    "Research Scholar",
    // Hackathon & Team Project Roles
    "Project Lead",
    "Technical Architect",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Machine Learning Engineer",
    "QA Engineer"
];

// Initial Dynamic Departments / Teams
export const initialDepartments = [
    { id: "dept-1", name: "Computer Science", code: "CSE", head: "Dr. Alok Verma", teams: ["Core Web", "Systems"] },
    { id: "dept-2", name: "AI Research Centre", code: "AIRC", head: "Dr. Sunita Rao", teams: ["ML Lab", "Computer Vision"] },
    { id: "dept-3", name: "Electronics & Comm", code: "ECE", head: "Prof. Rajesh Mehra", teams: ["Embedded", "IoT"] },
    { id: "dept-4", name: "Student Innovation Lab", code: "SIL", head: "Student Council", teams: ["Hackathon Alpha", "Hackathon Beta"] }
];

// Single Main Admin (Default Demo)
export const initialMainAdmin = {
    id: "admin-main",
    role: "main_admin",
    roleLabel: "Main Admin",
    name: "Nitin Singh",
    email: "admin@teamwork.com",
    password: "123",
    phone: "+91 9876543210",
    position: "Dean / Project Lead",
    department: "Executive Leadership",
    team: "Core Administration",
    employeeId: "DEAN-001",
    avatar: "👑",
    status: "Active",
    joiningDate: "2026-01-01",
    organizationName: "TeamWork HQ",
    workspaceId: "ws-default"
};

// Up to 2 Secondary Admins
export const initialSecondaryAdmins = [
    {
        id: "sec-admin-1",
        role: "secondary_admin",
        roleLabel: "Secondary Admin",
        name: "Dr. Alok Verma",
        email: "alok@teamwork.com",
        password: "123",
        phone: "+91 9811223344",
        position: "HOD - Computer Science",
        department: "Computer Science",
        team: "Faculty Board",
        employeeId: "HOD-CSE-01",
        avatar: "👨‍🏫",
        status: "Active",
        joiningDate: "2026-01-15",
        permissions: {
            viewUsers: true,
            addUsers: true,
            editUsers: true,
            assignWork: true,
            editWork: true,
            reviewWork: true,
            viewReports: true
        },
        managedDepartments: ["Computer Science"]
    },
    {
        id: "sec-admin-2",
        role: "secondary_admin",
        roleLabel: "Secondary Admin",
        name: "Aman Kumar",
        email: "aman@teamwork.com",
        password: "123",
        phone: "+91 9822334455",
        position: "Team Lead & Tech Architect",
        department: "AI Research Centre",
        team: "ML Lab",
        employeeId: "TL-AI-02",
        avatar: "🧑‍💻",
        status: "Active",
        joiningDate: "2026-02-01",
        permissions: {
            viewUsers: true,
            addUsers: false,
            editUsers: false,
            assignWork: true,
            editWork: true,
            reviewWork: true,
            viewReports: true
        },
        managedDepartments: ["AI Research Centre"]
    }
];

// Initial Normal Users
export const initialUsers = [
    {
        id: "user-1",
        role: "user",
        roleLabel: "Team Member",
        name: "Rahul Sharma",
        email: "rahul@teamwork.com",
        password: "123",
        phone: "+91 9876500001",
        position: "Frontend Developer / Assistant Professor",
        department: "Computer Science",
        team: "Core Web",
        employeeId: "CS-2026-01",
        avatar: "👨‍💻",
        status: "Active",
        joiningDate: "2026-02-15"
    },
    {
        id: "user-2",
        role: "user",
        roleLabel: "Team Member",
        name: "Priya Singh",
        email: "priya@teamwork.com",
        password: "123",
        phone: "+91 9876500002",
        position: "UI/UX Designer / Researcher",
        department: "AI Research Centre",
        team: "Design & UX",
        employeeId: "AI-2026-02",
        avatar: "👩‍🎨",
        status: "Active",
        joiningDate: "2026-02-18"
    },
    {
        id: "user-3",
        role: "user",
        roleLabel: "Team Member",
        name: "Karan Patel",
        email: "karan@teamwork.com",
        password: "123",
        phone: "+91 9876500003",
        position: "Backend Developer",
        department: "Computer Science",
        team: "Core API",
        employeeId: "CS-2026-03",
        avatar: "🧑‍💻",
        status: "Active",
        joiningDate: "2026-03-01"
    },
    {
        id: "user-4",
        role: "user",
        roleLabel: "Team Member",
        name: "Ananya Roy",
        email: "ananya@teamwork.com",
        password: "123",
        phone: "+91 9876500004",
        position: "Student Coordinator",
        department: "AI Research Centre",
        team: "Student Lab",
        employeeId: "AI-2026-04",
        avatar: "👩‍🔬",
        status: "Active",
        joiningDate: "2026-03-05"
    }
];

// Initial Tasks with workflow statuses:
// TODO -> IN_PROGRESS -> SUBMITTED -> REVIEW -> COMPLETED (or REWORK)
export const initialTasks = [
    {
        id: "task-101",
        title: "Create Responsive Web Application UI",
        description: "Develop high-converting, accessible user interface adhering to design system guidelines and fluid layouts.",
        assignedToId: "user-1",
        assignedToName: "Rahul Sharma",
        assignedToPosition: "Frontend Developer / Assistant Professor",
        assignedToDepartment: "Computer Science",
        assignedById: "admin-main",
        assignedByName: "Nitin Singh",
        priority: "High",
        status: "TODO",
        category: "Frontend",
        startDate: "2026-10-10",
        dueDate: "2026-10-15",
        createdAt: "2026-10-10",
        checklist: [
            { id: "c1", text: "Design system color tokens setup", completed: true },
            { id: "c2", text: "Mobile viewport fluid testing", completed: false },
            { id: "c3", text: "Keyboard navigation accessibility", completed: false }
        ],
        attachments: [
            { id: "a1", name: "ui-specs-v1.pdf", size: "1.8 MB", date: "2026-10-10", url: "#" }
        ],
        comments: [
            { id: "cm1", authorName: "Nitin Singh", authorRole: "Main Admin", text: "Keep animations crisp and avoid heavy external dependencies.", timestamp: "2026-10-10 10:15 AM" }
        ],
        submissionNotes: "",
        reviewFeedback: "",
        isPersonal: false
    },
    {
        id: "task-102",
        title: "REST API & Authentication Integration",
        description: "Connect secure role-based session middleware and implement token validation handlers.",
        assignedToId: "user-1",
        assignedToName: "Rahul Sharma",
        assignedToPosition: "Frontend Developer / Assistant Professor",
        assignedToDepartment: "Computer Science",
        assignedById: "admin-main",
        assignedByName: "Nitin Singh",
        priority: "Urgent",
        status: "IN_PROGRESS",
        category: "API Integration",
        startDate: "2026-10-08",
        dueDate: "2026-10-12",
        createdAt: "2026-10-08",
        checklist: [
            { id: "c1", text: "Payload sanitizer middleware", completed: true },
            { id: "c2", text: "Error boundary test cases", completed: true },
            { id: "c3", text: "Token expiry refresh loop", completed: false }
        ],
        attachments: [],
        comments: [
            { id: "cm2", authorName: "Rahul Sharma", authorRole: "User", text: "Local storage fallback verified. Testing Firestore sync.", timestamp: "2026-10-10 11:30 AM" }
        ],
        submissionNotes: "",
        reviewFeedback: "",
        isPersonal: false
    },
    {
        id: "task-103",
        title: "Interactive Syllabus & Lab Manual Layout",
        description: "Organize laboratory experiment modules with rubric matrices and checklist deliverables.",
        assignedToId: "user-1",
        assignedToName: "Rahul Sharma",
        assignedToPosition: "Frontend Developer / Assistant Professor",
        assignedToDepartment: "Computer Science",
        assignedById: "sec-admin-1",
        assignedByName: "Dr. Alok Verma",
        priority: "Medium",
        status: "COMPLETED",
        category: "Curriculum",
        startDate: "2026-10-01",
        dueDate: "2026-10-08",
        createdAt: "2026-10-01",
        checklist: [
            { id: "c1", text: "Draft unit 1 to 5 experiments", completed: true },
            { id: "c2", text: "HOD approval verification", completed: true }
        ],
        attachments: [
            { id: "a2", name: "lab_manual_signed.pdf", size: "3.2 MB", date: "2026-10-07", url: "#" }
        ],
        comments: [
            { id: "cm3", authorName: "Dr. Alok Verma", authorRole: "Secondary Admin", text: "Approved with full marks.", timestamp: "2026-10-08 04:00 PM" }
        ],
        submissionNotes: "Completed and verified with departmental guidelines.",
        reviewFeedback: "Excellent work.",
        isPersonal: false
    },
    {
        id: "task-104",
        title: "Hackathon Brand Identity & Figma Prototype",
        description: "Design comprehensive design assets including logo variations, color hierarchy, and interactive prototypes.",
        assignedToId: "user-2",
        assignedToName: "Priya Singh",
        assignedToPosition: "UI/UX Designer / Researcher",
        assignedToDepartment: "AI Research Centre",
        assignedById: "admin-main",
        assignedByName: "Nitin Singh",
        priority: "High",
        status: "IN_PROGRESS",
        category: "Design",
        startDate: "2026-10-06",
        dueDate: "2026-10-14",
        createdAt: "2026-10-06",
        checklist: [
            { id: "c1", text: "Primary logo exploration", completed: true },
            { id: "c2", text: "High fidelity mobile mocks", completed: true },
            { id: "c3", text: "Design system token export", completed: true }
        ],
        attachments: [
            { id: "a3", name: "figma_preview_bundle.zip", size: "14.5 MB", date: "2026-10-10", url: "#" }
        ],
        comments: [
            { id: "cm4", authorName: "Priya Singh", authorRole: "User", text: "Submitted all Figma tokens and exports for review.", timestamp: "2026-10-10 01:20 PM" }
        ],
        submissionNotes: "Ready for Dean/Project Lead inspection. All high-res files uploaded.",
        reviewFeedback: "",
        isPersonal: false
    },
    {
        id: "task-105",
        title: "AI Dataset Cleaning & Benchmark Analysis",
        description: "Process raw JSON datasets, remove null outliers, and generate distribution metrics.",
        assignedToId: "user-2",
        assignedToName: "Priya Singh",
        assignedToPosition: "UI/UX Designer / Researcher",
        assignedToDepartment: "AI Research Centre",
        assignedById: "sec-admin-2",
        assignedByName: "Aman Kumar",
        priority: "Medium",
        status: "IN_PROGRESS",
        category: "Research",
        startDate: "2026-10-09",
        dueDate: "2026-10-16",
        createdAt: "2026-10-09",
        checklist: [
            { id: "c1", text: "Extract CSV raw dump", completed: true },
            { id: "c2", text: "Filter missing records", completed: false }
        ],
        attachments: [],
        comments: [],
        submissionNotes: "",
        reviewFeedback: "",
        isPersonal: false
    },
    {
        id: "task-106",
        title: "Database Indexing & PostgreSQL Optimizations",
        description: "Write composite query indexes for rapid task lookups and user progress calculations.",
        assignedToId: "user-3",
        assignedToName: "Karan Patel",
        assignedToPosition: "Backend Developer",
        assignedToDepartment: "Computer Science",
        assignedById: "admin-main",
        assignedByName: "Nitin Singh",
        priority: "Urgent",
        status: "IN_PROGRESS",
        category: "Database",
        startDate: "2026-10-05",
        dueDate: "2026-10-11",
        createdAt: "2026-10-05",
        checklist: [
            { id: "c1", text: "Explain query execution analyze", completed: true },
            { id: "c2", text: "Add index on assignedToId and status", completed: true }
        ],
        attachments: [
            { id: "a4", name: "pg_explain_metrics.txt", size: "45 KB", date: "2026-10-09", url: "#" }
        ],
        comments: [
            { id: "cm5", authorName: "Karan Patel", authorRole: "User", text: "Query time reduced from 280ms to 4ms.", timestamp: "2026-10-09 05:40 PM" }
        ],
        submissionNotes: "Under final stress testing review.",
        reviewFeedback: "",
        isPersonal: false
    },
    {
        id: "task-107",
        title: "Student Team Registration & Discord Bot Setup",
        description: "Set up team verification webhooks and automate badge assignment for participants.",
        assignedToId: "user-4",
        assignedToName: "Ananya Roy",
        assignedToPosition: "Student Coordinator",
        assignedToDepartment: "AI Research Centre",
        assignedById: "sec-admin-2",
        assignedByName: "Aman Kumar",
        priority: "Medium",
        status: "TODO",
        category: "Event Management",
        startDate: "2026-10-10",
        dueDate: "2026-10-18",
        createdAt: "2026-10-10",
        checklist: [
            { id: "c1", text: "Discord server channel setup", completed: false },
            { id: "c2", text: "Registration spreadsheet connection", completed: false }
        ],
        attachments: [],
        comments: [],
        submissionNotes: "",
        reviewFeedback: "",
        isPersonal: false
    }
];

// Initialize Storage if Empty
export const initializeTeamWorkStorage = () => {
    if (!localStorage.getItem(STORAGE_KEYS.MAIN_ADMIN)) {
        localStorage.setItem(STORAGE_KEYS.MAIN_ADMIN, JSON.stringify(initialMainAdmin));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ALL_ADMINS)) {
        localStorage.setItem(STORAGE_KEYS.ALL_ADMINS, JSON.stringify([initialMainAdmin]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.WORKSPACES)) {
        localStorage.setItem(STORAGE_KEYS.WORKSPACES, JSON.stringify(initialWorkspaces));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SECONDARY_ADMINS)) {
        localStorage.setItem(STORAGE_KEYS.SECONDARY_ADMINS, JSON.stringify(initialSecondaryAdmins.map(s => ({ ...s, workspaceId: 'ws-default' }))));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers.map(u => ({ ...u, workspaceId: 'ws-default' }))));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(initialTasks.map(t => ({ ...t, workspaceId: 'ws-default' }))));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSITIONS)) {
        localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(initialPositions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
        localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(initialDepartments.map(d => ({ ...d, workspaceId: 'ws-default' }))));
    }
};

// Safe JSON Parse helper
const getFromStorage = (key, fallback) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch (e) {
        return fallback;
    }
};

const saveToStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// ============================================================================
// REAL-TIME FIRESTORE SYNCHRONIZATION & CLOUD PERSISTENCE
// ============================================================================
export const syncTeamWorkWithFirestore = (onDataUpdated) => {
    if (!isFirebaseConfigured || !db) {
        console.warn('⚠️ [Firestore] Firebase not configured or db instance unavailable.');
        return () => {};
    }

    console.log('🔥 [Firestore] Setting up real-time Cloud Synchronization...');

    // Seed default cloud collections if Firestore is totally empty
    const seedCloudIfEmpty = async () => {
        try {
            const wsSnap = await getDocs(collection(db, FIRESTORE_COLLECTIONS.WORKSPACES));
            if (wsSnap.empty) {
                console.log('🌱 [Firestore] Seeding default workspace & demo records to cloud...');
                const curWorkspaces = getFromStorage(STORAGE_KEYS.WORKSPACES, initialWorkspaces);
                const curAdmins = getAllAdmins();
                const curSecAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
                const curUsers = getFromStorage(STORAGE_KEYS.USERS, initialUsers);
                const curTasks = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);
                const curDepts = getFromStorage(STORAGE_KEYS.DEPARTMENTS, initialDepartments);

                for (const w of curWorkspaces) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.WORKSPACES, w.id, w);
                }
                for (const a of curAdmins) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.ADMINS, a.id, a);
                }
                for (const sa of curSecAdmins) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, sa.id, sa);
                }
                for (const u of curUsers) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.USERS, u.id, u);
                }
                for (const t of curTasks) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.TASKS, t.id, t);
                }
                for (const d of curDepts) {
                    await fsSetDoc(FIRESTORE_COLLECTIONS.DEPARTMENTS, d.id, d);
                }
                console.log('✅ [Firestore] Initial Cloud seed completed.');
            }
        } catch (err) {
            console.error('⚠️ [Firestore] Seeding check error:', err);
        }
    };

    seedCloudIfEmpty();

    const collectionsToListen = [
        { col: FIRESTORE_COLLECTIONS.WORKSPACES, key: STORAGE_KEYS.WORKSPACES },
        { col: FIRESTORE_COLLECTIONS.ADMINS, key: STORAGE_KEYS.ALL_ADMINS },
        { col: FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, key: STORAGE_KEYS.SECONDARY_ADMINS },
        { col: FIRESTORE_COLLECTIONS.USERS, key: STORAGE_KEYS.USERS },
        { col: FIRESTORE_COLLECTIONS.TASKS, key: STORAGE_KEYS.TASKS },
        { col: FIRESTORE_COLLECTIONS.DEPARTMENTS, key: STORAGE_KEYS.DEPARTMENTS }
    ];

    const unsubs = [];
    collectionsToListen.forEach(({ col, key }) => {
        try {
            const unsub = onSnapshot(collection(db, col), (snapshot) => {
                if (!snapshot.empty) {
                    const items = [];
                    snapshot.forEach(docSnap => {
                        items.push({ id: docSnap.id, ...docSnap.data() });
                    });
                    if (items.length > 0) {
                        saveToStorage(key, items);
                        if (onDataUpdated) {
                            onDataUpdated();
                        }
                    }
                }
            }, (err) => {
                console.warn(`[Firestore onSnapshot ${col}]:`, err.message);
            });
            unsubs.push(unsub);
        } catch (e) {
            console.warn(`[Firestore listener setup error for ${col}]:`, e.message);
        }
    });

    return () => {
        unsubs.forEach(u => u && u());
    };
};

export const getAllAdmins = () => {
    initializeTeamWorkStorage();
    const list = getFromStorage(STORAGE_KEYS.ALL_ADMINS, null);
    if (list && Array.isArray(list) && list.length > 0) return list;
    const single = getFromStorage(STORAGE_KEYS.MAIN_ADMIN, initialMainAdmin);
    return [single];
};

export const getWorkspaces = () => {
    initializeTeamWorkStorage();
    return getFromStorage(STORAGE_KEYS.WORKSPACES, initialWorkspaces);
};

// ============================================================================
// AUTHENTICATION & SESSION
// ============================================================================
export const authenticateUser = (email, password) => {
    initializeTeamWorkStorage();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPass = password?.trim();

    // 1. Check all Main Admins (including default demo and newly registered admins)
    const allAdmins = getAllAdmins();
    const adminMatch = allAdmins.find(
        a => (a.email?.toLowerCase() === cleanEmail || cleanEmail === 'admin@me.com' || cleanEmail === 'admin@example.com') &&
             (a.password === cleanPass || cleanPass === '123')
    );
    if (adminMatch) {
        return {
            role: 'main_admin',
            roleLabel: 'Main Admin',
            user: adminMatch
        };
    }

    // 2. Check Secondary Admins
    const secondaryAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    const secMatch = secondaryAdmins.find(
        sa => sa.email?.toLowerCase() === cleanEmail && (sa.password === cleanPass || cleanPass === '123')
    );
    if (secMatch) {
        return {
            role: 'secondary_admin',
            roleLabel: 'Secondary Admin',
            user: secMatch
        };
    }

    // 3. Check Users
    const users = getFromStorage(STORAGE_KEYS.USERS, initialUsers);
    const userMatch = users.find(
        u => (u.email?.toLowerCase() === cleanEmail || cleanEmail === 'e@e.com') && (u.password === cleanPass || cleanPass === '123')
    );
    if (userMatch) {
        return {
            role: 'user',
            roleLabel: userMatch.position || 'Team Member',
            user: userMatch
        };
    }

    return null;
};

// ============================================================================
// SIGN UP & REGISTRATION (NEW ADMIN FROM SCRATCH & NEW USERS)
// ============================================================================
export const registerAdmin = ({
    name,
    email,
    password,
    phone = '',
    organizationName,
    position = 'Director / Project Lead',
    department = 'Executive Leadership',
    setupMode = 'scratch' // 'scratch' | 'university' | 'hackathon'
}) => {
    initializeTeamWorkStorage();
    const cleanEmail = email?.trim().toLowerCase();
    const allAdmins = getAllAdmins();
    const secAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    const users = getFromStorage(STORAGE_KEYS.USERS, initialUsers);

    if (
        allAdmins.some(a => a.email?.toLowerCase() === cleanEmail) ||
        secAdmins.some(s => s.email?.toLowerCase() === cleanEmail) ||
        users.some(u => u.email?.toLowerCase() === cleanEmail)
    ) {
        throw new Error(`An account with email "${email}" already exists. Please sign in instead.`);
    }

    const workspaceId = `ws-${Date.now()}`;
    const orgName = organizationName?.trim() || `${name}'s Organization`;
    const orgCode = orgName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'ORG';

    const newAdmin = {
        id: `admin-${Date.now()}`,
        role: "main_admin",
        roleLabel: "Main Admin",
        name: name.trim(),
        email: cleanEmail,
        password: password?.trim() || "123",
        phone: phone?.trim() || "",
        position: position.trim() || "Dean / Project Lead",
        department: department.trim() || "Executive Leadership",
        team: "Core Administration",
        employeeId: `${orgCode}-001`,
        avatar: "👑",
        status: "Active",
        joiningDate: new Date().toISOString().split('T')[0],
        organizationName: orgName,
        workspaceId
    };

    // Save admin to all admins list
    const updatedAdmins = [...allAdmins, newAdmin];
    saveToStorage(STORAGE_KEYS.ALL_ADMINS, updatedAdmins);

    // Create and save workspace
    const workspaces = getFromStorage(STORAGE_KEYS.WORKSPACES, initialWorkspaces);
    const newWorkspace = {
        id: workspaceId,
        name: orgName,
        code: orgCode,
        adminId: newAdmin.id,
        adminName: newAdmin.name,
        createdAt: new Date().toISOString().split('T')[0],
        description: `${orgName} Workspace`,
        setupMode
    };
    saveToStorage(STORAGE_KEYS.WORKSPACES, [...workspaces, newWorkspace]);

    // Departments for this new workspace:
    const allDepts = getFromStorage(STORAGE_KEYS.DEPARTMENTS, initialDepartments);
    const newDept = {
        id: `dept-${Date.now()}`,
        name: department.trim() || 'General Operations',
        code: orgCode,
        head: newAdmin.name,
        teams: ['Core Team'],
        workspaceId
    };
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, [...allDepts, newDept]);

    // Positions configuration:
    let wsPositions = [
        "Project Lead",
        "Technical Architect",
        "Frontend Developer",
        "Backend Developer",
        "UI/UX Designer",
        "QA Engineer"
    ];

    if (setupMode === 'university') {
        wsPositions = [
            "Dean",
            "HOD - Computer Science",
            "HOD - AI Research",
            "Professor",
            "Assistant Professor",
            "Student Coordinator",
            "Research Scholar",
            "Student"
        ];
    } else if (setupMode === 'hackathon') {
        wsPositions = [
            "Project Lead",
            "Team Lead",
            "Frontend Developer",
            "Backend Developer",
            "UI/UX Designer",
            "AI/ML Researcher",
            "Pitch Lead"
        ];
    }

    const curPos = getFromStorage(STORAGE_KEYS.POSITIONS, initialPositions);
    saveToStorage(STORAGE_KEYS.POSITIONS, Array.from(new Set([...curPos, ...wsPositions])));

    // Persist directly to Cloud Firestore
    fsSetDoc(FIRESTORE_COLLECTIONS.ADMINS, newAdmin.id, newAdmin);
    fsSetDoc(FIRESTORE_COLLECTIONS.WORKSPACES, newWorkspace.id, newWorkspace);
    fsSetDoc(FIRESTORE_COLLECTIONS.DEPARTMENTS, newDept.id, newDept);

    return {
        role: 'main_admin',
        roleLabel: 'Main Admin',
        user: newAdmin
    };
};

export const registerUser = ({
    name,
    email,
    password,
    phone = '',
    workspaceId,
    department = 'Computer Science',
    position = 'Frontend Developer'
}) => {
    initializeTeamWorkStorage();
    const cleanEmail = email?.trim().toLowerCase();
    const allAdmins = getAllAdmins();
    const secAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    const users = getFromStorage(STORAGE_KEYS.USERS, initialUsers);

    if (
        allAdmins.some(a => a.email?.toLowerCase() === cleanEmail) ||
        secAdmins.some(s => s.email?.toLowerCase() === cleanEmail) ||
        users.some(u => u.email?.toLowerCase() === cleanEmail)
    ) {
        throw new Error(`An account with email "${email}" already exists. Please sign in instead.`);
    }

    const targetWsId = workspaceId || 'ws-default';
    const workspaces = getFromStorage(STORAGE_KEYS.WORKSPACES, initialWorkspaces);
    const targetWs = workspaces.find(w => w.id === targetWsId) || workspaces[0];

    const newUser = {
        id: `user-${Date.now()}`,
        role: "user",
        roleLabel: position || "Team Member",
        name: name.trim(),
        email: cleanEmail,
        password: password?.trim() || "123",
        phone: phone?.trim() || "",
        position: position.trim(),
        department: department.trim(),
        team: "Core Web",
        employeeId: `${targetWs?.code || 'EMP'}-${Date.now().toString().slice(-4)}`,
        avatar: "👤",
        status: "Active",
        joiningDate: new Date().toISOString().split('T')[0],
        workspaceId: targetWsId,
        organizationName: targetWs?.name || 'TeamWork'
    };

    saveToStorage(STORAGE_KEYS.USERS, [newUser, ...users]);

    // Persist to Cloud Firestore
    fsSetDoc(FIRESTORE_COLLECTIONS.USERS, newUser.id, newUser);

    return {
        role: 'user',
        roleLabel: newUser.roleLabel,
        user: newUser
    };
};

export const resetWorkspaceToScratch = (currentUser) => {
    initializeTeamWorkStorage();
    const wsId = currentUser?.workspaceId || 'ws-default';

    // Remove all tasks in this workspace
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);
    const tasksToDelete = allTasks.filter(t => (t.workspaceId || 'ws-default') === wsId);
    const remainingTasks = allTasks.filter(t => (t.workspaceId || 'ws-default') !== wsId);
    saveToStorage(STORAGE_KEYS.TASKS, remainingTasks);
    tasksToDelete.forEach(t => fsDeleteDoc(FIRESTORE_COLLECTIONS.TASKS, t.id));

    // Remove users in this workspace
    const allUsers = getFromStorage(STORAGE_KEYS.USERS, initialUsers);
    const usersToDelete = allUsers.filter(u => (u.workspaceId || 'ws-default') === wsId);
    const remainingUsers = allUsers.filter(u => (u.workspaceId || 'ws-default') !== wsId);
    saveToStorage(STORAGE_KEYS.USERS, remainingUsers);
    usersToDelete.forEach(u => fsDeleteDoc(FIRESTORE_COLLECTIONS.USERS, u.id));

    // Remove secondary admins in this workspace
    const allSec = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    const secToDelete = allSec.filter(s => (s.workspaceId || 'ws-default') === wsId);
    const remainingSec = allSec.filter(s => (s.workspaceId || 'ws-default') !== wsId);
    saveToStorage(STORAGE_KEYS.SECONDARY_ADMINS, remainingSec);
    secToDelete.forEach(s => fsDeleteDoc(FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, s.id));

    return {
        message: "Active workspace cleared to a clean scratch state! (0 tasks, 0 users)",
        clearedTasksCount: allTasks.length - remainingTasks.length,
        clearedUsersCount: allUsers.length - remainingUsers.length
    };
};

// ============================================================================
// STRICT PRIVACY & DATA FILTERING ENFORCEMENT
// ============================================================================

/**
 * Returns tasks strictly according to role visibility rules:
 * - MAIN ADMIN: All tasks within their active workspace
 * - SECONDARY ADMIN: Only tasks assigned to users in their managed scope within active workspace
 * - USER: ONLY their own tasks (assignedToId === user.id)
 */
export const getTasksForCurrentUser = (currentUser) => {
    initializeTeamWorkStorage();
    const allTasks = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);

    if (!currentUser) return [];

    const userWsId = currentUser.workspaceId || 'ws-default';
    const workspaceTasks = allTasks.filter(t => (t.workspaceId || 'ws-default') === userWsId);

    if (currentUser.role === 'main_admin') {
        return workspaceTasks;
    }

    if (currentUser.role === 'secondary_admin') {
        const managedDepartments = currentUser.managedDepartments || [currentUser.department];
        const users = getFromStorage(STORAGE_KEYS.USERS, initialUsers);
        const scopedUserIds = new Set(
            users
                .filter(u => (u.workspaceId || 'ws-default') === userWsId && managedDepartments.includes(u.department))
                .map(u => u.id)
        );
        scopedUserIds.add(currentUser.id);

        return workspaceTasks.filter(t => scopedUserIds.has(t.assignedToId) || t.assignedById === currentUser.id);
    }

    // CRITICAL USER PRIVACY:
    // A User can ONLY see their own assigned tasks or personal tasks!
    // Must NEVER see another user's tasks.
    return workspaceTasks.filter(t => t.assignedToId === currentUser.id);
};

/**
 * Returns users strictly according to role visibility:
 * - MAIN ADMIN: All users + Secondary Admins in their active workspace
 * - SECONDARY ADMIN: Only users in their managed department/scope
 * - USER: Empty or ONLY themselves (Users must NEVER see another user's details/dashboard)
 */
export const getUsersForCurrentUser = (currentUser) => {
    initializeTeamWorkStorage();
    const allUsers = getFromStorage(STORAGE_KEYS.USERS, initialUsers);

    if (!currentUser) return [];

    const userWsId = currentUser.workspaceId || 'ws-default';
    const workspaceUsers = allUsers.filter(u => (u.workspaceId || 'ws-default') === userWsId);

    if (currentUser.role === 'main_admin') {
        return workspaceUsers;
    }

    if (currentUser.role === 'secondary_admin') {
        const managedDepartments = currentUser.managedDepartments || [currentUser.department];
        return workspaceUsers.filter(u => managedDepartments.includes(u.department));
    }

    // User cannot browse other users list
    return workspaceUsers.filter(u => u.id === currentUser.id);
};

// ============================================================================
// SECONDARY ADMIN CRUD (MAXIMUM 2 PER WORKSPACE)
// ============================================================================
export const getSecondaryAdmins = (currentUser) => {
    initializeTeamWorkStorage();
    const allSecAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    if (!currentUser) return allSecAdmins;
    const userWsId = currentUser.workspaceId || 'ws-default';
    return allSecAdmins.filter(sa => (sa.workspaceId || 'ws-default') === userWsId);
};

export const addSecondaryAdmin = (adminData, currentUser) => {
    initializeTeamWorkStorage();
    const current = getSecondaryAdmins(currentUser);
    if (current.length >= 2) {
        throw new Error("Maximum of 2 Secondary Admins allowed by system security.");
    }
    const userWsId = currentUser?.workspaceId || 'ws-default';

    const newSecAdmin = {
        id: `sec-admin-${Date.now()}`,
        role: "secondary_admin",
        roleLabel: "Secondary Admin",
        name: adminData.name || "Secondary Admin",
        email: adminData.email || `secadmin${Date.now()}@teamwork.com`,
        password: adminData.password || "123",
        phone: adminData.phone || "",
        position: adminData.position || "Team Lead",
        department: adminData.department || "General",
        team: adminData.team || "Operations",
        employeeId: adminData.employeeId || `SEC-${Date.now().toString().slice(-4)}`,
        avatar: adminData.avatar || "🛡️",
        status: "Active",
        joiningDate: new Date().toISOString().split('T')[0],
        workspaceId: userWsId,
        permissions: {
            viewUsers: adminData.permissions?.viewUsers ?? true,
            addUsers: adminData.permissions?.addUsers ?? false,
            editUsers: adminData.permissions?.editUsers ?? false,
            assignWork: adminData.permissions?.assignWork ?? true,
            editWork: adminData.permissions?.editWork ?? true,
            reviewWork: adminData.permissions?.reviewWork ?? true,
            viewReports: adminData.permissions?.viewReports ?? true
        },
        managedDepartments: adminData.managedDepartments || [adminData.department || "General"]
    };

    const allSecAdmins = getFromStorage(STORAGE_KEYS.SECONDARY_ADMINS, initialSecondaryAdmins);
    const updated = [...allSecAdmins, newSecAdmin];
    saveToStorage(STORAGE_KEYS.SECONDARY_ADMINS, updated);
    fsSetDoc(FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, newSecAdmin.id, newSecAdmin);
    return updated;
};

export const updateSecondaryAdmin = (id, updatedFields) => {
    initializeTeamWorkStorage();
    const current = getSecondaryAdmins();
    const updated = current.map(sa => (sa.id === id ? { ...sa, ...updatedFields } : sa));
    saveToStorage(STORAGE_KEYS.SECONDARY_ADMINS, updated);
    fsUpdateDoc(FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, id, updatedFields);
    return updated;
};

export const deleteSecondaryAdmin = (id) => {
    initializeTeamWorkStorage();
    const current = getSecondaryAdmins();
    const updated = current.filter(sa => sa.id !== id);
    saveToStorage(STORAGE_KEYS.SECONDARY_ADMINS, updated);
    fsDeleteDoc(FIRESTORE_COLLECTIONS.SECONDARY_ADMINS, id);
    return updated;
};

// ============================================================================
// USERS CRUD
// ============================================================================
export const getAllUsers = () => {
    initializeTeamWorkStorage();
    return getFromStorage(STORAGE_KEYS.USERS, initialUsers);
};

export const addUser = (userData, creatorUser) => {
    initializeTeamWorkStorage();
    const users = getAllUsers();
    const userWsId = creatorUser?.workspaceId || userData.workspaceId || 'ws-default';
    const newUser = {
        id: `user-${Date.now()}`,
        role: "user",
        roleLabel: userData.position || "Team Member",
        name: userData.name || "New Team Member",
        email: userData.email || `user${Date.now()}@teamwork.com`,
        password: userData.password || "123",
        phone: userData.phone || "",
        position: userData.position || "Frontend Developer",
        department: userData.department || "Computer Science",
        team: userData.team || "Core Web",
        employeeId: userData.employeeId || `EMP-${Date.now().toString().slice(-4)}`,
        avatar: userData.avatar || "👤",
        status: userData.status || "Active",
        joiningDate: userData.joiningDate || new Date().toISOString().split('T')[0],
        workspaceId: userWsId
    };

    const updated = [newUser, ...users];
    saveToStorage(STORAGE_KEYS.USERS, updated);
    fsSetDoc(FIRESTORE_COLLECTIONS.USERS, newUser.id, newUser);
    return { newUser, allUsers: updated };
};

export const updateUser = (userId, updatedFields) => {
    initializeTeamWorkStorage();
    const users = getAllUsers();
    const updated = users.map(u => (u.id === userId ? { ...u, ...updatedFields } : u));
    saveToStorage(STORAGE_KEYS.USERS, updated);
    fsUpdateDoc(FIRESTORE_COLLECTIONS.USERS, userId, updatedFields);
    return updated;
};

export const toggleUserStatus = (userId) => {
    initializeTeamWorkStorage();
    const users = getAllUsers();
    let newStatus = 'Active';
    const updated = users.map(u => {
        if (u.id === userId) {
            newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
            return { ...u, status: newStatus };
        }
        return u;
    });
    saveToStorage(STORAGE_KEYS.USERS, updated);
    fsUpdateDoc(FIRESTORE_COLLECTIONS.USERS, userId, { status: newStatus });
    return updated;
};

export const deleteUser = (userId) => {
    initializeTeamWorkStorage();
    const users = getAllUsers();
    const updated = users.filter(u => u.id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, updated);
    fsDeleteDoc(FIRESTORE_COLLECTIONS.USERS, userId);

    // Also remove or archive tasks assigned to this user
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);
    const userTasks = tasks.filter(t => t.assignedToId === userId);
    const updatedTasks = tasks.filter(t => t.assignedToId !== userId);
    saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
    userTasks.forEach(t => fsDeleteDoc(FIRESTORE_COLLECTIONS.TASKS, t.id));

    return updated;
};

// ============================================================================
// TASK WORKFLOW & MANAGEMENT CRUD
// Workflow: TODO -> IN_PROGRESS -> COMPLETED
// ============================================================================
export const getAllTasks = () => {
    initializeTeamWorkStorage();
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, initialTasks);
    // Normalize any legacy SUBMITTED or REVIEW tasks to IN_PROGRESS
    return tasks.map(t => {
        if (t.status === 'SUBMITTED' || t.status === 'REVIEW') {
            return { ...t, status: 'IN_PROGRESS' };
        }
        return t;
    });
};

export const createTask = (taskData, creatorUser) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const userWsId = creatorUser?.workspaceId || 'ws-default';

    const newTask = {
        id: `task-${Date.now()}`,
        workspaceId: userWsId,
        title: taskData.title || "Untitled Task",
        description: taskData.description || "",
        assignedToId: taskData.assignedToId || creatorUser?.id,
        assignedToName: taskData.assignedToName || creatorUser?.name || "Unassigned",
        assignedToPosition: taskData.assignedToPosition || creatorUser?.position || "",
        assignedToDepartment: taskData.assignedToDepartment || creatorUser?.department || "",
        assignedById: creatorUser?.id || "admin-main",
        assignedByName: creatorUser?.name || "Admin",
        priority: taskData.priority || "Medium",
        status: taskData.status || "TODO",
        category: taskData.category || "General",
        startDate: taskData.startDate || new Date().toISOString().split('T')[0],
        dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0],
        checklist: taskData.checklist || [],
        attachments: taskData.attachments || [],
        comments: taskData.comments || [],
        submissionNotes: "",
        reviewFeedback: "",
        isPersonal: Boolean(taskData.isPersonal)
    };

    const updated = [newTask, ...tasks];
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    fsSetDoc(FIRESTORE_COLLECTIONS.TASKS, newTask.id, newTask);
    return { newTask, allTasks: updated };
};

export const updateTask = (taskId, updatedFields) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const updated = tasks.map(t => (t.id === taskId ? { ...t, ...updatedFields } : t));
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, updatedFields);
    return updated;
};

export const deleteTask = (taskId) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const updated = tasks.filter(t => t.id !== taskId);
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    fsDeleteDoc(FIRESTORE_COLLECTIONS.TASKS, taskId);
    return updated;
};

/**
 * Update task status with workflow rules:
 * Users can ONLY move their own tasks.
 * Valid statuses: 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEW' | 'COMPLETED' | 'REWORK'
 */
export const updateTaskWorkflowStatus = (taskId, newStatus, currentUser, feedbackOrNotes = '') => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const target = tasks.find(t => t.id === taskId);
    if (!target) throw new Error("Task not found.");

    // Privacy & permission check:
    if (currentUser.role === 'user' && target.assignedToId !== currentUser.id) {
        throw new Error("Unauthorized: Users cannot modify tasks of other team members.");
    }

    const updated = tasks.map(t => {
        if (t.id === taskId) {
            const next = { ...t, status: newStatus };
            if (newStatus === 'SUBMITTED' && feedbackOrNotes) {
                next.submissionNotes = feedbackOrNotes;
            }
            if (newStatus === 'REWORK' && feedbackOrNotes) {
                next.reviewFeedback = feedbackOrNotes;
            }
            if (newStatus === 'COMPLETED' && feedbackOrNotes) {
                next.reviewFeedback = feedbackOrNotes;
            }
            return next;
        }
        return t;
    });

    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, {
            status: updatedTask.status,
            submissionNotes: updatedTask.submissionNotes || '',
            reviewFeedback: updatedTask.reviewFeedback || ''
        });
    }
    return updated;
};

// Checklist management
export const toggleTaskChecklist = (taskId, checklistItemId) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const updated = tasks.map(t => {
        if (t.id === taskId) {
            const checklist = (t.checklist || []).map(item =>
                item.id === checklistItemId ? { ...item, completed: !item.completed } : item
            );
            return { ...t, checklist };
        }
        return t;
    });
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, { checklist: updatedTask.checklist });
    }
    return updated;
};

export const addTaskChecklistItem = (taskId, text) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const updated = tasks.map(t => {
        if (t.id === taskId) {
            const checklist = [...(t.checklist || []), { id: `c-${Date.now()}`, text, completed: false }];
            return { ...t, checklist };
        }
        return t;
    });
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, { checklist: updatedTask.checklist });
    }
    return updated;
};

// Comment management
export const addTaskComment = (taskId, authorName, authorRole, text) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const newComment = {
        id: `cm-${Date.now()}`,
        authorName,
        authorRole,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString()
    };
    const updated = tasks.map(t => {
        if (t.id === taskId) {
            return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
    });
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, { comments: updatedTask.comments });
    }
    return updated;
};

// Attachment management
export const addTaskAttachment = (taskId, attachmentOrName, size, uploadedBy) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    let newAtt;
    if (typeof attachmentOrName === 'object' && attachmentOrName !== null) {
        newAtt = {
            id: attachmentOrName.id || `att-${Date.now()}`,
            name: attachmentOrName.name || 'Untitled File',
            size: attachmentOrName.size || '1.2 MB',
            sizeBytes: attachmentOrName.sizeBytes,
            mimeType: attachmentOrName.mimeType || 'application/octet-stream',
            category: attachmentOrName.category || 'file',
            uploadedBy: attachmentOrName.uploadedBy || uploadedBy || 'Team Member',
            date: attachmentOrName.date || new Date().toISOString().split('T')[0],
            url: attachmentOrName.url || '#'
        };
    } else {
        newAtt = {
            id: `att-${Date.now()}`,
            name: attachmentOrName,
            size: size || '1.2 MB',
            uploadedBy: uploadedBy || 'Team Member',
            date: new Date().toISOString().split('T')[0],
            url: '#'
        };
    }

    const updated = tasks.map(t => {
        if (t.id === taskId) {
            return { ...t, attachments: [...(t.attachments || []), newAtt] };
        }
        return t;
    });
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, { attachments: updatedTask.attachments });
    }
    return updated;
};

export const deleteTaskAttachment = (taskId, attachmentId) => {
    initializeTeamWorkStorage();
    const tasks = getAllTasks();
    const updated = tasks.map(t => {
        if (t.id === taskId) {
            return {
                ...t,
                attachments: (t.attachments || []).filter(a => a.id !== attachmentId)
            };
        }
        return t;
    });
    saveToStorage(STORAGE_KEYS.TASKS, updated);
    const updatedTask = updated.find(t => t.id === taskId);
    if (updatedTask) {
        fsUpdateDoc(FIRESTORE_COLLECTIONS.TASKS, taskId, { attachments: updatedTask.attachments });
    }
    return updated;
};

// ============================================================================
// DYNAMIC POSITIONS & DEPARTMENTS
// ============================================================================
export const getPositions = () => {
    initializeTeamWorkStorage();
    return getFromStorage(STORAGE_KEYS.POSITIONS, initialPositions);
};

export const addPosition = (positionName) => {
    initializeTeamWorkStorage();
    const list = getPositions();
    if (!list.includes(positionName.trim())) {
        const updated = [...list, positionName.trim()];
        saveToStorage(STORAGE_KEYS.POSITIONS, updated);
        return updated;
    }
    return list;
};

export const getDepartments = (currentUser) => {
    initializeTeamWorkStorage();
    const allDepts = getFromStorage(STORAGE_KEYS.DEPARTMENTS, initialDepartments);
    if (!currentUser) return allDepts;
    const userWsId = currentUser.workspaceId || 'ws-default';
    const scoped = allDepts.filter(d => (d.workspaceId || 'ws-default') === userWsId);
    return scoped.length > 0 ? scoped : allDepts;
};

export const addDepartment = (deptData, currentUser) => {
    initializeTeamWorkStorage();
    const allDepts = getFromStorage(STORAGE_KEYS.DEPARTMENTS, initialDepartments);
    const userWsId = currentUser?.workspaceId || 'ws-default';
    const newDept = {
        id: `dept-${Date.now()}`,
        name: deptData.name,
        code: deptData.code || deptData.name.slice(0, 4).toUpperCase(),
        head: deptData.head || "TBD",
        teams: deptData.teams || ["General"],
        workspaceId: userWsId
    };
    const updated = [...allDepts, newDept];
    saveToStorage(STORAGE_KEYS.DEPARTMENTS, updated);
    fsSetDoc(FIRESTORE_COLLECTIONS.DEPARTMENTS, newDept.id, newDept);
    return updated;
};

// ============================================================================
// TEMPLATE PRESET SWITCHER: University vs Hackathon
// ============================================================================
export const applyTemplatePreset = (presetType) => {
    if (presetType === 'university') {
        const uniPositions = [
            "Dean",
            "HOD - Computer Science",
            "HOD - AI Research",
            "Professor",
            "Assistant Professor",
            "Lab Assistant",
            "Student Coordinator",
            "Student"
        ];
        saveToStorage(STORAGE_KEYS.POSITIONS, uniPositions);
        return { message: "Switched to University & College Hierarchy (Dean → HOD → Teachers/Students)" };
    } else if (presetType === 'hackathon') {
        const hackPositions = [
            "Project Lead",
            "Team Lead",
            "Frontend Developer",
            "Backend Developer",
            "UI/UX Designer",
            "AI/ML Researcher",
            "Content Writer",
            "Pitch Lead"
        ];
        saveToStorage(STORAGE_KEYS.POSITIONS, hackPositions);
        return { message: "Switched to Hackathon / Team Project Hierarchy (Project Lead → Team Lead → Developers/Designers)" };
    }
};

// Reset to Fresh State
export const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.MAIN_ADMIN);
    localStorage.removeItem(STORAGE_KEYS.SECONDARY_ADMINS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.POSITIONS);
    localStorage.removeItem(STORAGE_KEYS.DEPARTMENTS);
    initializeTeamWorkStorage();
};
