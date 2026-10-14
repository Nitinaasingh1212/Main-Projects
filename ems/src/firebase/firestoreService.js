import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import {
    initialOrganizations,
    initialDepartments,
    defaultHierarchyEmployees,
    initialAdmin,
    getMeetingsFromStorage,
    saveMeetingToStorage,
    deleteMeetingFromStorage,
    getOrganizationsFromStorage,
    saveOrganizationToStorage,
    updateOrganizationInStorage,
    deleteOrganizationFromStorage,
    getDepartmentsFromStorage,
    saveDepartmentToStorage,
    updateDepartmentInStorage,
    deleteDepartmentFromStorage,
    getLocalStorage
} from "../utils/localStorage";

/**
 * Seed initial organizations, departments, employees, admins, and meetings into Firestore if empty
 */
export const seedInitialDataIfEmpty = async () => {
    if (!isFirebaseConfigured || !db) return;

    try {
        const orgSnapshot = await getDocs(collection(db, "organizations"));
        if (orgSnapshot.empty) {
            console.log("🌱 Seeding initial organizations to Firestore...");
            for (const org of initialOrganizations) {
                await setDoc(doc(db, "organizations", org.id), org);
            }
        }

        const deptSnapshot = await getDocs(collection(db, "departments"));
        if (deptSnapshot.empty) {
            console.log("🌱 Seeding initial departments to Firestore...");
            for (const dept of initialDepartments) {
                await setDoc(doc(db, "departments", dept.id), dept);
            }
        }

        const empSnapshot = await getDocs(collection(db, "employees"));
        if (empSnapshot.empty) {
            console.log("🌱 Seeding initial employees to Firestore...");
            for (const emp of defaultHierarchyEmployees) {
                await setDoc(doc(db, "employees", String(emp.id)), emp);
            }
        }

        const adminSnapshot = await getDocs(collection(db, "admins"));
        if (adminSnapshot.empty) {
            console.log("🌱 Seeding initial admin to Firestore...");
            for (const adm of initialAdmin) {
                await setDoc(doc(db, "admins", `admin-${adm.id}`), adm);
            }
        }

        const meetSnapshot = await getDocs(collection(db, "meetings"));
        if (meetSnapshot.empty) {
            console.log("🌱 Seeding initial meetings to Firestore...");
            const initialMeetings = getMeetingsFromStorage();
            for (const meet of initialMeetings) {
                await setDoc(doc(db, "meetings", meet.id), meet);
            }
        }
    } catch (error) {
        console.error("Error seeding initial data to Firestore:", error);
    }
};

/**
 * =========================================================================
 * ORGANIZATIONS CRUD & REAL-TIME
 * =========================================================================
 */
export const subscribeToOrganizations = (callback) => {
    if (!isFirebaseConfigured || !db) {
        callback(getOrganizationsFromStorage());
        return () => { };
    }

    const q = collection(db, "organizations");
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            if (snapshot.empty) {
                callback(getOrganizationsFromStorage());
                return;
            }
            const orgs = [];
            snapshot.forEach((docSnap) => {
                orgs.push({ docId: docSnap.id, ...docSnap.data() });
            });
            orgs.sort((a, b) => (a.code || 0) - (b.code || 0));
            callback(orgs);
        },
        (error) => {
            console.error("Error in subscribeToOrganizations snapshot:", error);
            callback(getOrganizationsFromStorage());
        }
    );

    return unsubscribe;
};

export const createOrganization = async (orgData) => {
    const localData = saveOrganizationToStorage(orgData);
    if (isFirebaseConfigured && db) {
        try {
            const orgId = orgData.id || `org-${orgData.code || Date.now()}`;
            await setDoc(doc(db, "organizations", orgId), { ...orgData, id: orgId });
        } catch (e) {
            console.error("Firestore createOrganization error:", e);
        }
    }
    return { success: true, localData };
};

export const updateOrganization = async (orgId, updateData) => {
    const localData = updateOrganizationInStorage(orgId, updateData);
    if (isFirebaseConfigured && db) {
        try {
            const docRef = doc(db, "organizations", orgId);
            await updateDoc(docRef, updateData);
        } catch (e) {
            console.error("Firestore updateOrganization error:", e);
        }
    }
    return { success: true, localData };
};

export const deleteOrganization = async (orgId) => {
    const localData = deleteOrganizationFromStorage(orgId);
    if (isFirebaseConfigured && db) {
        try {
            await deleteDoc(doc(db, "organizations", orgId));
        } catch (e) {
            console.error("Firestore deleteOrganization error:", e);
        }
    }
    return { success: true, localData };
};

/**
 * =========================================================================
 * DEPARTMENTS CRUD & REAL-TIME
 * =========================================================================
 */
export const subscribeToDepartments = (callback) => {
    if (!isFirebaseConfigured || !db) {
        callback(getDepartmentsFromStorage());
        return () => { };
    }

    const q = collection(db, "departments");
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            if (snapshot.empty) {
                callback(getDepartmentsFromStorage());
                return;
            }
            const depts = [];
            snapshot.forEach((docSnap) => {
                depts.push({ docId: docSnap.id, ...docSnap.data() });
            });
            depts.sort((a, b) => (a.sn || 0) - (b.sn || 0));
            callback(depts);
        },
        (error) => {
            console.error("Error in subscribeToDepartments snapshot:", error);
            callback(getDepartmentsFromStorage());
        }
    );

    return unsubscribe;
};

export const createDepartment = async (deptData) => {
    const localData = saveDepartmentToStorage(deptData);
    if (isFirebaseConfigured && db) {
        try {
            const deptId = deptData.id || `dept-${Date.now()}`;
            await setDoc(doc(db, "departments", deptId), { ...deptData, id: deptId });
        } catch (e) {
            console.error("Firestore createDepartment error:", e);
        }
    }
    return { success: true, localData };
};

export const updateDepartment = async (deptId, updateData) => {
    const localData = updateDepartmentInStorage(deptId, updateData);
    if (isFirebaseConfigured && db) {
        try {
            const docRef = doc(db, "departments", deptId);
            await updateDoc(docRef, updateData);
        } catch (e) {
            console.error("Firestore updateDepartment error:", e);
        }
    }
    return { success: true, localData };
};

export const deleteDepartment = async (deptId) => {
    const localData = deleteDepartmentFromStorage(deptId);
    if (isFirebaseConfigured && db) {
        try {
            await deleteDoc(doc(db, "departments", deptId));
        } catch (e) {
            console.error("Firestore deleteDepartment error:", e);
        }
    }
    return { success: true, localData };
};

/**
 * =========================================================================
 * EMPLOYEES & USERS CRUD & REAL-TIME
 * =========================================================================
 */
export const subscribeToEmployees = (callback) => {
    if (!isFirebaseConfigured || !db) {
        const { employees } = getLocalStorage();
        callback(employees);
        return () => { };
    }

    const q = collection(db, "employees");
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const employees = [];
            snapshot.forEach((docSnap) => {
                employees.push({
                    docId: docSnap.id,
                    ...docSnap.data()
                });
            });
            employees.sort((a, b) => {
                const levelA = a.hierarchyLevel || 3;
                const levelB = b.hierarchyLevel || 3;
                if (levelA !== levelB) return levelA - levelB;
                return (a.id || 0) - (b.id || 0);
            });
            callback(employees);
        },
        (error) => {
            console.error("Error in subscribeToEmployees snapshot:", error);
            const { employees } = getLocalStorage();
            callback(employees);
        }
    );

    return unsubscribe;
};

export const addEmployeeProfile = async (newEmployeeData) => {
    const { employees } = getLocalStorage();
    const nextId = employees.length > 0 ? Math.max(...employees.map(e => e.id || 0)) + 1 : 1;

    const newEmp = {
        id: nextId,
        firstName: newEmployeeData.firstName || "New User",
        email: newEmployeeData.email || `user${nextId}@example.com`,
        password: newEmployeeData.password || "123",
        company: newEmployeeData.company || "Reliance Pvt Ltd",
        companyCode: newEmployeeData.companyCode || 10001,
        designation: newEmployeeData.designation || "Operations Specialist",
        department: newEmployeeData.department || "Operations",
        hierarchyLevel: Number(newEmployeeData.hierarchyLevel) || 3,
        reportsTo: newEmployeeData.reportsTo || "Nitin",
        avatar: newEmployeeData.avatar || "👤",
        taskCounts: {
            active: 0,
            newTask: 0,
            completed: 0,
            failed: 0
        },
        tasks: []
    };

    const updatedEmployees = [...employees, newEmp];
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            await setDoc(doc(db, "employees", String(nextId)), newEmp);
        } catch (e) {
            console.error("Error creating employee profile in Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees, newEmployee: newEmp };
};

export const deleteEmployeeProfile = async (employeeId) => {
    const { employees } = getLocalStorage();
    const updatedEmployees = employees.filter(
        e => String(e.id) !== String(employeeId) && e.docId !== employeeId && e.firstName !== employeeId
    );
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            await deleteDoc(doc(db, "employees", String(employeeId)));
        } catch (e) {
            console.error("Error deleting employee profile from Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees };
};

export const addTaskToEmployee = async (assigneeNameOrId, taskData) => {
    const { employees } = getLocalStorage();
    let found = false;

    const updatedEmployees = employees.map(emp => {
        const matches = (
            emp.firstName?.toLowerCase() === assigneeNameOrId?.toLowerCase() ||
            String(emp.id) === String(assigneeNameOrId) ||
            emp.docId === assigneeNameOrId
        );

        if (matches) {
            found = true;
            const currentTasks = emp.tasks || [];
            const newTask = {
                active: false,
                newTask: true,
                completed: false,
                failed: false,
                taskTitle: taskData.taskTitle,
                taskDescription: taskData.taskDescription,
                taskDate: taskData.taskDate,
                category: taskData.category || 'General',
                priority: taskData.priority || 'Medium',
                meetLink: taskData.meetLink || undefined
            };

            const updatedTasks = [newTask, ...currentTasks];
            const currentCounts = emp.taskCounts || { active: 0, newTask: 0, completed: 0, failed: 0 };
            const updatedCounts = {
                ...currentCounts,
                newTask: (currentCounts.newTask || 0) + 1
            };

            return {
                ...emp,
                tasks: updatedTasks,
                taskCounts: updatedCounts
            };
        }
        return emp;
    });

    if (!found) {
        throw new Error(`Employee "${assigneeNameOrId}" not found.`);
    }

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            const targetEmp = updatedEmployees.find(emp =>
                emp.firstName?.toLowerCase() === assigneeNameOrId?.toLowerCase() ||
                String(emp.id) === String(assigneeNameOrId) ||
                emp.docId === assigneeNameOrId
            );
            if (targetEmp) {
                const targetDocId = targetEmp.docId || String(targetEmp.id);
                await updateDoc(doc(db, "employees", targetDocId), {
                    tasks: targetEmp.tasks,
                    taskCounts: targetEmp.taskCounts
                });
            }
        } catch (e) {
            console.error("Error updating employee task in Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees };
};

export const updateTaskStatus = async (employeeIdOrName, taskIndex, newStatus) => {
    const { employees } = getLocalStorage();

    const updatedEmployees = employees.map(emp => {
        const matches = (
            emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
            String(emp.id) === String(employeeIdOrName) ||
            emp.docId === employeeIdOrName
        );

        if (matches && emp.tasks && emp.tasks[taskIndex]) {
            const updatedTasks = [...emp.tasks];
            const target = { ...updatedTasks[taskIndex] };

            target.newTask = (newStatus === 'new');
            target.active = (newStatus === 'active' || newStatus === 'accept');
            target.completed = (newStatus === 'completed' || newStatus === 'complete');
            target.failed = (newStatus === 'failed' || newStatus === 'fail');

            updatedTasks[taskIndex] = target;

            const newCounts = {
                newTask: updatedTasks.filter(t => t.newTask && !t.active && !t.completed && !t.failed).length,
                active: updatedTasks.filter(t => t.active && !t.completed && !t.failed).length,
                completed: updatedTasks.filter(t => t.completed).length,
                failed: updatedTasks.filter(t => t.failed).length
            };

            return {
                ...emp,
                tasks: updatedTasks,
                taskCounts: newCounts
            };
        }
        return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            const targetEmp = updatedEmployees.find(emp =>
                emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
                String(emp.id) === String(employeeIdOrName) ||
                emp.docId === employeeIdOrName
            );
            if (targetEmp) {
                const targetDocId = targetEmp.docId || String(targetEmp.id);
                await updateDoc(doc(db, "employees", targetDocId), {
                    tasks: targetEmp.tasks,
                    taskCounts: targetEmp.taskCounts
                });
            }
        } catch (e) {
            console.error("Error syncing task status in Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees };
};

export const deleteTaskFromEmployee = async (employeeIdOrName, taskIndex) => {
    const { employees } = getLocalStorage();

    const updatedEmployees = employees.map(emp => {
        const matches = (
            emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
            String(emp.id) === String(employeeIdOrName) ||
            emp.docId === employeeIdOrName
        );

        if (matches && emp.tasks) {
            const updatedTasks = emp.tasks.filter((_, idx) => idx !== taskIndex);
            const newCounts = {
                newTask: updatedTasks.filter(t => t.newTask && !t.active && !t.completed && !t.failed).length,
                active: updatedTasks.filter(t => t.active && !t.completed && !t.failed).length,
                completed: updatedTasks.filter(t => t.completed).length,
                failed: updatedTasks.filter(t => t.failed).length
            };

            return {
                ...emp,
                tasks: updatedTasks,
                taskCounts: newCounts
            };
        }
        return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            const targetEmp = updatedEmployees.find(emp =>
                emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
                String(emp.id) === String(employeeIdOrName) ||
                emp.docId === employeeIdOrName
            );
            if (targetEmp) {
                const targetDocId = targetEmp.docId || String(targetEmp.id);
                await updateDoc(doc(db, "employees", targetDocId), {
                    tasks: targetEmp.tasks,
                    taskCounts: targetEmp.taskCounts
                });
            }
        } catch (e) {
            console.error("Error deleting task from Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees };
};

export const updateEmployeeHierarchy = async (employeeIdOrName, { hierarchyLevel, reportsTo, designation }) => {
    const { employees } = getLocalStorage();

    const updatedEmployees = employees.map(emp => {
        const matches = (
            emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
            String(emp.id) === String(employeeIdOrName) ||
            emp.docId === employeeIdOrName
        );

        if (matches) {
            return {
                ...emp,
                hierarchyLevel: hierarchyLevel !== undefined ? Number(hierarchyLevel) : emp.hierarchyLevel,
                reportsTo: reportsTo !== undefined ? reportsTo : emp.reportsTo,
                designation: designation !== undefined ? designation : emp.designation
            };
        }
        return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    if (isFirebaseConfigured && db) {
        try {
            const targetEmp = updatedEmployees.find(emp =>
                emp.firstName?.toLowerCase() === employeeIdOrName?.toLowerCase() ||
                String(emp.id) === String(employeeIdOrName) ||
                emp.docId === employeeIdOrName
            );
            if (targetEmp) {
                const targetDocId = targetEmp.docId || String(targetEmp.id);
                await updateDoc(doc(db, "employees", targetDocId), {
                    hierarchyLevel: targetEmp.hierarchyLevel,
                    reportsTo: targetEmp.reportsTo,
                    designation: targetEmp.designation
                });
            }
        } catch (e) {
            console.error("Error updating hierarchy in Firestore:", e);
        }
    }

    return { success: true, localData: updatedEmployees };
};

/**
 * =========================================================================
 * MEETINGS CRUD & REAL-TIME
 * =========================================================================
 */
export const subscribeToMeetings = (callback) => {
    if (!isFirebaseConfigured || !db) {
        callback(getMeetingsFromStorage());
        return () => { };
    }

    const q = collection(db, "meetings");
    const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
            const meetings = [];
            snapshot.forEach((docSnap) => {
                meetings.push({
                    docId: docSnap.id,
                    ...docSnap.data()
                });
            });
            meetings.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            callback(meetings);
        },
        (error) => {
            console.error("Error in subscribeToMeetings snapshot:", error);
            callback(getMeetingsFromStorage());
        }
    );

    return unsubscribe;
};

export const createMeeting = async (meetingData) => {
    const updatedMeetings = saveMeetingToStorage(meetingData);

    if (isFirebaseConfigured && db) {
        try {
            const meetId = meetingData.id || `meet-${Date.now()}`;
            await setDoc(doc(db, "meetings", meetId), {
                ...meetingData,
                id: meetId
            });
        } catch (e) {
            console.error("Error creating meeting in Firestore:", e);
        }
    }

    return { success: true, localData: updatedMeetings };
};

export const deleteMeeting = async (meetingId) => {
    const updatedMeetings = deleteMeetingFromStorage(meetingId);

    if (isFirebaseConfigured && db) {
        try {
            await deleteDoc(doc(db, "meetings", meetingId));
        } catch (e) {
            console.error("Error deleting meeting from Firestore:", e);
        }
    }

    return { success: true, localData: updatedMeetings };
};

export const updateMeetingStatus = async (meetingId, newStatus) => {
    const meetings = getMeetingsFromStorage();
    const updated = meetings.map(m => m.id === meetingId ? { ...m, status: newStatus } : m);
    localStorage.setItem('meetings', JSON.stringify(updated));

    if (isFirebaseConfigured && db) {
        try {
            await updateDoc(doc(db, "meetings", meetingId), { status: newStatus });
        } catch (e) {
            console.error("Error updating meeting status in Firestore:", e);
        }
    }

    return { success: true, localData: updated };
};

/**
 * =========================================================================
 * AUTHENTICATION
 * =========================================================================
 */
export const authenticateCredentials = async (email, password, cachedEmployees = null) => {
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();

    // Check for Admin / Super Admin (Nitin)
    if (
        (cleanEmail === 'admin@me.com' || cleanEmail === 'admin@example.com' || cleanEmail === 'nitin@xyzops.com') && 
        cleanPassword === '123'
    ) {
        return {
            role: 'admin',
            roleLabel: 'Super Admin',
            data: {
                firstName: 'Nitin',
                email: cleanEmail,
                role: 'admin',
                roleLabel: 'Super Admin',
                company: 'XYZ Operations Global',
                designation: 'Super Admin & Operations Director',
                department: 'Executive',
                hierarchyLevel: 1
            }
        };
    }

    // Check employees in cached data or localStorage
    const employeeList = cachedEmployees || getLocalStorage().employees || [];
    const matchedEmployee = employeeList.find(
        emp => emp.email?.toLowerCase() === cleanEmail && String(emp.password) === cleanPassword
    );

    if (matchedEmployee) {
        return {
            role: 'employee',
            roleLabel: matchedEmployee.designation || 'Member',
            data: matchedEmployee
        };
    }

    return null;
};
