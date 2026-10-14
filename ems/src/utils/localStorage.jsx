// Local storage mock data and helpers for XYZ OPS platform

export const initialOrganizations = [
    {
        id: "org-10001",
        code: 10001,
        name: "Reliance Pvt Ltd",
        website: "reliance.com",
        pan: "AABCR1234F",
        gst: "27AABCR1234F1Z5",
        state: "Maharashtra",
        city: "Mumbai",
        pocName: "Mukesh Ambani",
        pocPhone: "9820012345",
        pocEmail: "admin@reliance.com",
        subscription: "Enterprise Elite",
        status: "Active",
        activeTasks: 42,
        tasksVolume: 323234,
        createdDate: "2026-01-15"
    },
    {
        id: "org-10002",
        code: 10002,
        name: "Tata Consultancy Services",
        website: "tcs.com",
        pan: "AAACT5678G",
        gst: "27AAACT5678G1Z2",
        state: "Maharashtra",
        city: "Mumbai",
        pocName: "K. Krithivasan",
        pocPhone: "9820054321",
        pocEmail: "admin@tcs.com",
        subscription: "Enterprise Plus",
        status: "Active",
        activeTasks: 33,
        tasksVolume: 33234,
        createdDate: "2026-02-01"
    },
    {
        id: "org-10003",
        code: 10003,
        name: "Infosys Ltd",
        website: "infosys.com",
        pan: "AABCI9012H",
        gst: "29AABCI9012H1Z8",
        state: "Karnataka",
        city: "Bengaluru",
        pocName: "Salil Parekh",
        pocPhone: "9880012345",
        pocEmail: "admin@infosys.com",
        subscription: "Enterprise Elite",
        status: "Active",
        activeTasks: 58,
        tasksVolume: 123234,
        createdDate: "2026-02-10"
    },
    {
        id: "org-10004",
        code: 10004,
        name: "Wipro Technologies",
        website: "wipro.com",
        pan: "AABCW3456J",
        gst: "29AABCW3456J1Z1",
        state: "Karnataka",
        city: "Bengaluru",
        pocName: "Srini Pallia",
        pocPhone: "9880098765",
        pocEmail: "admin@wipro.com",
        subscription: "Enterprise Plus",
        status: "Active",
        activeTasks: 39,
        tasksVolume: 223234,
        createdDate: "2026-02-20"
    },
    {
        id: "org-10005",
        code: 10005,
        name: "HCL Technologies",
        website: "hcltech.com",
        pan: "EEEEE5678E",
        gst: "27EEEEE5678E1ZZ",
        state: "Uttar Pradesh",
        city: "Noida",
        pocName: "C Vijayakumar",
        pocPhone: "9876543214",
        pocEmail: "vijay@hcl.com",
        subscription: "Enterprise Standard",
        status: "Active",
        activeTasks: 27,
        tasksVolume: 23234,
        createdDate: "2026-03-01"
    },
    {
        id: "org-10006",
        code: 10006,
        name: "Unilever",
        website: "unilever.com",
        pan: "AAACU7890K",
        gst: "27AAACU7890K1Z4",
        state: "Maharashtra",
        city: "Mumbai",
        pocName: "Hein Schumacher",
        pocPhone: "9820045678",
        pocEmail: "admin@unilever.com",
        subscription: "Enterprise Plus",
        status: "Active",
        activeTasks: 19,
        tasksVolume: 12234,
        createdDate: "2026-03-05"
    },
    {
        id: "org-10007",
        code: 10007,
        name: "Nestle",
        website: "nestle.com",
        pan: "AAACN1234L",
        gst: "07AAACN1234L1Z9",
        state: "Delhi",
        city: "New Delhi",
        pocName: "Mark Schneider",
        pocPhone: "9810012345",
        pocEmail: "admin@nestle.com",
        subscription: "Enterprise Standard",
        status: "Active",
        activeTasks: 14,
        tasksVolume: 3234,
        createdDate: "2026-03-12"
    },
    {
        id: "org-10008",
        code: 10008,
        name: "Accenture",
        website: "accenture.com",
        pan: "AAACA9988M",
        gst: "27AAACA9988M1Z3",
        state: "Maharashtra",
        city: "Mumbai",
        pocName: "Julie Sweet",
        pocPhone: "9820099887",
        pocEmail: "admin@accenture.com",
        subscription: "Global Flagship",
        status: "Active",
        activeTasks: 84,
        tasksVolume: 323234,
        createdDate: "2026-01-05"
    }
];

export const initialDepartments = [
    { id: "dept-1", sn: 1, company: "Reliance Pvt Ltd", code: 10001, department: "Finance", status: "Active" },
    { id: "dept-2", sn: 2, company: "Reliance Pvt Ltd", code: 10001, department: "HR", status: "Active" },
    { id: "dept-3", sn: 3, company: "Reliance Pvt Ltd", code: 10001, department: "IT", status: "Active" },
    { id: "dept-4", sn: 4, company: "Tata Consultancy Services", code: 10002, department: "Software Development", status: "Active" },
    { id: "dept-5", sn: 5, company: "Tata Consultancy Services", code: 10002, department: "Finance", status: "Active" },
    { id: "dept-6", sn: 6, company: "Tata Consultancy Services", code: 10002, department: "HR", status: "Active" },
    { id: "dept-7", sn: 7, company: "Infosys Ltd", code: 10003, department: "Software Development", status: "Active" },
    { id: "dept-8", sn: 8, company: "Infosys Ltd", code: 10003, department: "HR", status: "Active" },
    { id: "dept-9", sn: 9, company: "Infosys Ltd", code: 10003, department: "IT", status: "Active" },
    { id: "dept-10", sn: 10, company: "Wipro Technologies", code: 10004, department: "Engineering", status: "Active" },
    { id: "dept-11", sn: 11, company: "HCL Technologies", code: 10005, department: "Cloud Infrastructure", status: "Active" },
    { id: "dept-12", sn: 12, company: "HCL Technologies", code: 10005, department: "DevOps & SRE", status: "Active" },
    { id: "dept-13", sn: 13, company: "Unilever", code: 10006, department: "Operations", status: "Active" },
    { id: "dept-14", sn: 14, company: "Nestle", code: 10007, department: "Supply Chain", status: "Active" },
    { id: "dept-15", sn: 15, company: "Accenture", code: 10008, department: "Enterprise Architecture", status: "Active" }
];

export const defaultHierarchyEmployees = [
    {
        id: 1,
        firstName: "Arjun",
        email: "e@e.com",
        password: "123",
        company: "HCL Technologies",
        companyCode: 10005,
        designation: "Engineering Lead & Architect",
        department: "Cloud Infrastructure",
        hierarchyLevel: 2,
        reportsTo: "Nitin",
        avatar: "👨‍💻",
        taskCounts: {
            active: 1,
            newTask: 1,
            completed: 1,
            failed: 0
        },
        tasks: [
            {
                active: false,
                newTask: true,
                completed: false,
                failed: false,
                taskTitle: "Design Organization Flow",
                taskDescription: "Implement multi-tenant organization creation and edit flows with GST validation",
                taskDate: "2026-10-12",
                category: "Design",
                priority: "High",
                meetLink: "https://meet.google.com/xyz-ops-arch"
            },
            {
                active: false,
                newTask: false,
                completed: true,
                failed: false,
                taskTitle: "Department Table Pagination",
                taskDescription: "Create clean department list with code search and instant CRUD controls",
                taskDate: "2026-10-10",
                category: "Engineering",
                priority: "Medium",
                meetLink: "https://meet.google.com/abc-ops-sync"
            },
            {
                active: true,
                newTask: false,
                completed: false,
                failed: false,
                taskTitle: "Optimize Real-time Sync",
                taskDescription: "Resolve synchronization state between Super Admin dashboard and task boards",
                taskDate: "2026-10-14",
                category: "Backend",
                priority: "Urgent"
            }
        ]
    },
    {
        id: 2,
        firstName: "Sneha",
        email: "employee2@example.com",
        password: "123",
        company: "Infosys Ltd",
        companyCode: 10003,
        designation: "Head of Product & Design",
        department: "Software Development",
        hierarchyLevel: 2,
        reportsTo: "Nitin",
        avatar: "👩‍🎨",
        taskCounts: {
            active: 1,
            newTask: 0,
            completed: 1,
            failed: 0
        },
        tasks: [
            {
                active: true,
                newTask: false,
                completed: false,
                failed: false,
                taskTitle: "Task Creation Trend Chart",
                taskDescription: "Design interactive visual trend chart for XYZ OPS analytics overview",
                taskDate: "2026-10-11",
                category: "Design",
                priority: "High"
            },
            {
                active: false,
                newTask: false,
                completed: true,
                failed: false,
                taskTitle: "UI Color System Refinement",
                taskDescription: "Build crisp white card layout with subtle sky-blue active sidebar accents",
                taskDate: "2026-10-09",
                category: "Design",
                priority: "Medium",
                meetLink: "https://meet.google.com/des-ops-room"
            }
        ]
    },
    {
        id: 3,
        firstName: "Ravi",
        email: "employee3@example.com",
        password: "123",
        company: "Tata Consultancy Services",
        companyCode: 10002,
        designation: "Senior Full-Stack Engineer",
        department: "Software Development",
        hierarchyLevel: 3,
        reportsTo: "Arjun",
        avatar: "🧑‍💻",
        taskCounts: {
            active: 1,
            newTask: 0,
            completed: 1,
            failed: 1
        },
        tasks: [
            {
                active: false,
                newTask: false,
                completed: true,
                failed: false,
                taskTitle: "Organizations CRUD API",
                taskDescription: "Implement complete add, edit, delete handlers with instant local & cloud persistence",
                taskDate: "2026-10-08",
                category: "Development",
                priority: "High"
            },
            {
                active: false,
                newTask: false,
                completed: false,
                failed: true,
                taskTitle: "Legacy Data Migration",
                taskDescription: "Migrate older schema items to unified XYZ OPS architecture",
                taskDate: "2026-10-05",
                category: "Database",
                priority: "Low"
            },
            {
                active: true,
                newTask: false,
                completed: false,
                failed: false,
                taskTitle: "Super Admin Role Auth",
                taskDescription: "Validate privileged operations and department allocation guardrails",
                taskDate: "2026-10-15",
                category: "Security",
                priority: "High"
            }
        ]
    },
    {
        id: 4,
        firstName: "Priya",
        email: "employee4@example.com",
        password: "123",
        company: "Wipro Technologies",
        companyCode: 10004,
        designation: "Senior Cloud & DevOps Engineer",
        department: "Engineering",
        hierarchyLevel: 3,
        reportsTo: "Arjun",
        avatar: "👩‍💻",
        taskCounts: {
            active: 1,
            newTask: 1,
            completed: 0,
            failed: 0
        },
        tasks: [
            {
                active: false,
                newTask: true,
                completed: false,
                failed: false,
                taskTitle: "Department Creation Flow",
                taskDescription: "Add interactive modal and standalone create view with company code lookup",
                taskDate: "2026-10-13",
                category: "DevOps",
                priority: "Medium"
            },
            {
                active: true,
                newTask: false,
                completed: false,
                failed: false,
                taskTitle: "Production Infrastructure Check",
                taskDescription: "Automate health monitoring and metric ingestion for 233 active organizations",
                taskDate: "2026-10-11",
                category: "DevOps",
                priority: "Urgent"
            }
        ]
    },
    {
        id: 5,
        firstName: "Karan",
        email: "employee5@example.com",
        password: "123",
        company: "Reliance Pvt Ltd",
        companyCode: 10001,
        designation: "Associate QA & Operations Specialist",
        department: "IT",
        hierarchyLevel: 4,
        reportsTo: "Sneha",
        avatar: "🎨",
        taskCounts: {
            active: 1,
            newTask: 1,
            completed: 1,
            failed: 0
        },
        tasks: [
            {
                active: false,
                newTask: true,
                completed: false,
                failed: false,
                taskTitle: "Cross-browser Verification",
                taskDescription: "Verify pixel-perfect alignment of XYZ OPS sidebar, stat cards, and tables",
                taskDate: "2026-10-14",
                category: "QA",
                priority: "Medium"
            },
            {
                active: false,
                newTask: false,
                completed: true,
                failed: false,
                taskTitle: "Google Meet Link Routing",
                taskDescription: "Ensure instantaneous meet generation launches in new tab with copy notification",
                taskDate: "2026-10-09",
                category: "QA",
                priority: "Low"
            },
            {
                active: true,
                newTask: false,
                completed: false,
                failed: false,
                taskTitle: "User Management Audit",
                taskDescription: "Verify user profile addition with company code and department mapping",
                taskDate: "2026-10-12",
                category: "Support",
                priority: "Medium"
            }
        ]
    }
];

export const initialAdmin = [
    {
        id: 1,
        email: "admin@me.com",
        password: "123",
        firstName: "Nitin",
        role: "admin",
        roleLabel: "Super Admin",
        designation: "Super Admin & Operations Director",
        department: "Executive",
        company: "XYZ Operations Global",
        hierarchyLevel: 1
    },
    {
        id: 2,
        email: "admin@example.com",
        password: "123",
        firstName: "Nitin",
        role: "admin",
        roleLabel: "Super Admin",
        designation: "Super Admin & Operations Director",
        department: "Executive",
        company: "XYZ Operations Global",
        hierarchyLevel: 1
    }
];

export const initialMeetings = [
    {
        id: "meet-standup-1",
        title: "Daily Operations Sync & Sprint Standup",
        meetUrl: "https://meet.google.com/xyz-ops-sync",
        meetCode: "xyz-ops-sync",
        date: new Date().toISOString().split('T')[0],
        time: "10:30",
        duration: "30 mins",
        agenda: "Review active organizations, department allocations, and daily task burndown.",
        hostName: "Nitin",
        attendees: ["All"],
        department: "All",
        status: "live"
    },
    {
        id: "meet-arch-2",
        title: "Enterprise Architecture Review",
        meetUrl: "https://meet.google.com/xyz-arch-review",
        meetCode: "xyz-arch-review",
        date: new Date().toISOString().split('T')[0],
        time: "14:00",
        duration: "45 mins",
        agenda: "Deep dive into multi-tenant hierarchy model and database indexing.",
        hostName: "Arjun",
        attendees: ["Arjun", "Ravi", "Priya"],
        department: "Engineering",
        status: "scheduled"
    },
    {
        id: "meet-client-3",
        title: "HCL Technologies Onboarding & POC Handover",
        meetUrl: "https://meet.google.com/hcl-onboard-sync",
        meetCode: "hcl-onboard-sync",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: "16:00",
        duration: "60 mins",
        agenda: "Administrator handover session with C Vijayakumar (POC - HCL Tech).",
        hostName: "Nitin",
        attendees: ["Nitin", "Sneha"],
        department: "Operations",
        status: "scheduled"
    }
];

export const setLocalStorage = () => {
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify(defaultHierarchyEmployees));
    }
    if (!localStorage.getItem('admin')) {
        localStorage.setItem('admin', JSON.stringify(initialAdmin));
    }
    if (!localStorage.getItem('meetings')) {
        localStorage.setItem('meetings', JSON.stringify(initialMeetings));
    }
    if (!localStorage.getItem('organizations')) {
        localStorage.setItem('organizations', JSON.stringify(initialOrganizations));
    }
    if (!localStorage.getItem('departments')) {
        localStorage.setItem('departments', JSON.stringify(initialDepartments));
    }
};

export const getLocalStorage = () => {
    setLocalStorage();
    const employees = JSON.parse(localStorage.getItem('employees')) || defaultHierarchyEmployees;
    const admin = JSON.parse(localStorage.getItem('admin')) || initialAdmin;
    const meetings = JSON.parse(localStorage.getItem('meetings')) || initialMeetings;
    const organizations = JSON.parse(localStorage.getItem('organizations')) || initialOrganizations;
    const departments = JSON.parse(localStorage.getItem('departments')) || initialDepartments;

    return { employees, admin, meetings, organizations, departments };
};

// Organizations Storage Helpers
export const getOrganizationsFromStorage = () => {
    setLocalStorage();
    try {
        return JSON.parse(localStorage.getItem('organizations')) || initialOrganizations;
    } catch (e) {
        return initialOrganizations;
    }
};

export const saveOrganizationToStorage = (orgData) => {
    const list = getOrganizationsFromStorage();
    const newCode = orgData.code || (list.length > 0 ? Math.max(...list.map(o => o.code || 10000)) + 1 : 10001);
    const newOrg = {
        id: orgData.id || `org-${newCode}`,
        code: newCode,
        name: orgData.name || "New Organization",
        website: orgData.website || "example.com",
        pan: orgData.pan || "",
        gst: orgData.gst || "",
        state: orgData.state || "Maharashtra",
        city: orgData.city || "Mumbai",
        pocName: orgData.pocName || "",
        pocPhone: orgData.pocPhone || "",
        pocEmail: orgData.pocEmail || "",
        subscription: orgData.subscription || "Enterprise Standard",
        status: orgData.status || "Active",
        activeTasks: orgData.activeTasks || 0,
        tasksVolume: orgData.tasksVolume || 0,
        createdDate: orgData.createdDate || new Date().toISOString().split('T')[0]
    };

    const updated = [newOrg, ...list];
    localStorage.setItem('organizations', JSON.stringify(updated));
    return updated;
};

export const updateOrganizationInStorage = (orgId, updatedFields) => {
    const list = getOrganizationsFromStorage();
    const updated = list.map(org => {
        if (org.id === orgId || String(org.code) === String(orgId)) {
            return { ...org, ...updatedFields };
        }
        return org;
    });
    localStorage.setItem('organizations', JSON.stringify(updated));
    return updated;
};

export const deleteOrganizationFromStorage = (orgId) => {
    const list = getOrganizationsFromStorage();
    const updated = list.filter(org => org.id !== orgId && String(org.code) !== String(orgId));
    localStorage.setItem('organizations', JSON.stringify(updated));
    return updated;
};

// Departments Storage Helpers
export const getDepartmentsFromStorage = () => {
    setLocalStorage();
    try {
        return JSON.parse(localStorage.getItem('departments')) || initialDepartments;
    } catch (e) {
        return initialDepartments;
    }
};

export const saveDepartmentToStorage = (deptData) => {
    const list = getDepartmentsFromStorage();
    const nextSN = list.length > 0 ? Math.max(...list.map(d => d.sn || 0)) + 1 : 1;
    const newDept = {
        id: deptData.id || `dept-${Date.now()}`,
        sn: nextSN,
        company: deptData.company || "General Organization",
        code: deptData.code || 10001,
        department: deptData.department || "Operations",
        status: deptData.status || "Active"
    };

    const updated = [...list, newDept];
    localStorage.setItem('departments', JSON.stringify(updated));
    return updated;
};

export const updateDepartmentInStorage = (deptId, updatedFields) => {
    const list = getDepartmentsFromStorage();
    const updated = list.map(dept => {
        if (dept.id === deptId || String(dept.sn) === String(deptId)) {
            return { ...dept, ...updatedFields };
        }
        return dept;
    });
    localStorage.setItem('departments', JSON.stringify(updated));
    return updated;
};

export const deleteDepartmentFromStorage = (deptId) => {
    const list = getDepartmentsFromStorage();
    const updated = list.filter(dept => dept.id !== deptId && String(dept.sn) !== String(deptId));
    // Recalculate serial numbers
    const renumbered = updated.map((d, idx) => ({ ...d, sn: idx + 1 }));
    localStorage.setItem('departments', JSON.stringify(renumbered));
    return renumbered;
};

// Meetings Storage Helpers
export const getMeetingsFromStorage = () => {
    setLocalStorage();
    try {
        return JSON.parse(localStorage.getItem('meetings')) || initialMeetings;
    } catch (e) {
        return initialMeetings;
    }
};

export const saveMeetingToStorage = (meetingData) => {
    const meetings = getMeetingsFromStorage();
    const newMeeting = {
        id: meetingData.id || `meet-${Date.now()}`,
        title: meetingData.title || "Quick Meeting",
        date: meetingData.date || new Date().toISOString().split('T')[0],
        time: meetingData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: meetingData.duration || "30 mins",
        meetUrl: meetingData.meetUrl || "https://meet.google.com/new",
        meetCode: meetingData.meetCode || "quick-meet",
        agenda: meetingData.agenda || "Team sync and project update",
        hostName: meetingData.hostName || "Nitin",
        attendees: meetingData.attendees || ["All"],
        department: meetingData.department || "All",
        status: meetingData.status || "scheduled"
    };
    const updated = [newMeeting, ...meetings];
    localStorage.setItem('meetings', JSON.stringify(updated));
    return updated;
};

export const deleteMeetingFromStorage = (meetingId) => {
    const meetings = getMeetingsFromStorage();
    const updated = meetings.filter(m => m.id !== meetingId);
    localStorage.setItem('meetings', JSON.stringify(updated));
    return updated;
};
