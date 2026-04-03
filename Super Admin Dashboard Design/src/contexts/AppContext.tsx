import { createContext, useContext, useState, ReactNode } from "react";
import {
  AuditProvider,
  InstitutionsProvider,
  PlansProvider,
  SystemProvider,
  ToastsProvider,
  UsersProvider,
} from "./domainProviders";
import type {
  AppEnvironment,
  AuditLog,
  Institution,
  NewInstitutionData,
  Plan,
  ToastNotification,
  User,
} from "../types/domain";

export type {
  AppEnvironment,
  AuditLog,
  Institution,
  NewInstitutionData,
  Plan,
  ToastNotification,
  User,
} from "../types/domain";

// ==================== TYPES ====================

// ==================== CONTEXT ====================

interface AppContextType {
  // Data State
  institutions: Institution[];
  users: User[];
  plans: Plan[];
  auditLogs: AuditLog[];
  
  // Institution Actions
  createInstitution: (data: NewInstitutionData) => number;
  updateInstitution: (id: number, updates: Partial<Institution>) => void;
  suspendInstitution: (id: number, reason: string) => void;
  resumeInstitution: (id: number) => void;
  archiveInstitution: (id: number) => void;
  changeInstitutionPlan: (id: number, planId: number) => void;
  toggleInstitutionFeature: (id: number, feature: string) => void;
  
  // User Actions
  updateUser: (id: number, updates: Partial<User>) => void;
  suspendUser: (id: number, reason: string) => void;
  activateUser: (id: number) => void;
  forceLogout: (id: number) => void;
  resetUserPassword: (id: number) => void;
  
  // Plan Actions
  createPlan: (plan: Omit<Plan, "id">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  
  // Audit Actions
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  
  // Toast Notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;
  
  // Global State
  currentUser: string;
  environment: AppEnvironment;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==================== INITIAL DATA ====================

const initialInstitutions: Institution[] = [
  { id: 1, name: "Stanford University", type: "University", country: "United States", plan: "Enterprise", featuresEnabled: ["attendance", "ai-scoring", "analytics", "timetable"], activeUsers: 45230, storageUsage: 847, status: "active", createdDate: "2024-01-15", lastModified: "2025-12-29", modifiedBy: "admin@platform.com" },
  { id: 2, name: "Harvard University", type: "University", country: "United States", plan: "Enterprise", featuresEnabled: ["attendance", "ai-scoring", "analytics", "timetable", "research"], activeUsers: 38920, storageUsage: 723, status: "active", createdDate: "2024-02-20", lastModified: "2025-12-28", modifiedBy: "admin@platform.com" },
  { id: 3, name: "MIT", type: "University", country: "United States", plan: "Pro", featuresEnabled: ["attendance", "ai-scoring", "timetable"], activeUsers: 28450, storageUsage: 512, status: "active", createdDate: "2024-03-10", lastModified: "2025-12-27", modifiedBy: "admin@platform.com" },
  { id: 4, name: "UC Berkeley", type: "University", country: "United States", plan: "Enterprise", featuresEnabled: ["attendance", "ai-scoring", "analytics", "timetable"], activeUsers: 42100, storageUsage: 891, status: "active", createdDate: "2024-01-25", lastModified: "2025-12-29", modifiedBy: "admin@platform.com" },
  { id: 5, name: "University of Chicago", type: "University", country: "United States", plan: "Starter", featuresEnabled: ["attendance", "timetable"], activeUsers: 15670, storageUsage: 234, status: "suspended", createdDate: "2024-04-05", lastModified: "2025-12-20", modifiedBy: "admin@platform.com" },
];

const initialUsers: User[] = [
  { id: 1, name: "Dr. Sarah Chen", email: "s.chen@stanford.edu", institution: "Stanford University", institutionId: 1, role: "Faculty", status: "active", lastLogin: "2 hours ago", activityLevel: "high", createdDate: "2024-01-15" },
  { id: 2, name: "Michael Torres", email: "m.torres@harvard.edu", institution: "Harvard University", institutionId: 2, role: "Student", status: "active", lastLogin: "5 hours ago", activityLevel: "high", createdDate: "2024-02-20" },
  { id: 3, name: "Emily Williams", email: "e.williams@mit.edu", institution: "MIT", institutionId: 3, role: "Admin", status: "active", lastLogin: "1 day ago", activityLevel: "medium", createdDate: "2024-01-10" },
  { id: 4, name: "James Anderson", email: "j.anderson@stanford.edu", institution: "Stanford University", institutionId: 1, role: "Student", status: "active", lastLogin: "3 hours ago", activityLevel: "high", createdDate: "2024-03-05" },
  { id: 5, name: "Lisa Martinez", email: "l.martinez@uchicago.edu", institution: "University of Chicago", institutionId: 5, role: "Faculty", status: "suspended", lastLogin: "5 days ago", activityLevel: "low", createdDate: "2024-01-25" },
];

const initialPlans: Plan[] = [
  { id: 1, name: "Starter", tier: "starter", price: 2999, userLimit: 500, storageLimit: 50, features: ["attendance", "timetable"], status: "active" },
  { id: 2, name: "Pro", tier: "pro", price: 9999, userLimit: 2000, storageLimit: 200, features: ["attendance", "timetable", "ai-scoring", "analytics"], status: "active" },
  { id: 3, name: "Enterprise", tier: "enterprise", price: 24999, userLimit: 10000, storageLimit: 1000, features: ["attendance", "timetable", "ai-scoring", "analytics", "research", "custom-integrations"], status: "active" },
];

// ==================== PROVIDER ====================

export function AppProvider({ children }: { children: ReactNode }) {
  const [institutions, setInstitutions] = useState<Institution[]>(initialInstitutions);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [plans] = useState<Plan[]>(initialPlans);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [currentUser] = useState("admin@platform.com");
  const [environment] = useState<AppEnvironment>("production");

  // ==================== AUDIT LOGGING ====================
  
  const addAuditLog = (log: Omit<AuditLog, "id" | "timestamp">) => {
    const newLog: AuditLog = {
      ...log,
      id: auditLogs.length + 1,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ==================== TOAST NOTIFICATIONS ====================
  
  const addToast = (toast: Omit<ToastNotification, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // ==================== INSTITUTION ACTIONS ====================
  
  const createInstitution = (data: NewInstitutionData) => {
    const newId = institutions.length + 1;
    const newInstitution: Institution = {
      id: newId,
      name: data.name,
      type: data.type,
      country: data.country,
      timezone: data.timezone,
      academicSession: data.academicSession,
      branding: data.branding,
      plan: plans.find(p => p.id === data.planId)?.name || "Starter",
      featuresEnabled: data.featuresEnabled,
      activeUsers: 0,
      storageUsage: 0,
      status: "active",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: currentUser,
      adminEmail: data.adminEmail,
      autoStructureEnabled: data.autoStructureEnabled,
    };
    setInstitutions(prev => [...prev, newInstitution]);
    
    addToast({
      type: "success",
      title: "Institution Created",
      message: `New institution "${data.name}" has been created successfully.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Institution Created",
      resource: `Institution #${newId}: ${data.name}`,
      details: JSON.stringify(data),
      ipAddress: "192.168.1.1",
      status: "success",
    });
    
    return newId;
  };

  const updateInstitution = (id: number, updates: Partial<Institution>) => {
    setInstitutions(prev => prev.map(inst => 
      inst.id === id 
        ? { ...inst, ...updates, lastModified: new Date().toISOString().split('T')[0], modifiedBy: currentUser }
        : inst
    ));
    
    addAuditLog({
      user: currentUser,
      action: "Institution Updated",
      resource: `Institution #${id}`,
      details: JSON.stringify(updates),
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const suspendInstitution = (id: number, reason: string) => {
    const institution = institutions.find(i => i.id === id);
    if (!institution) return;

    // Update institution status
    updateInstitution(id, { status: "suspended" });
    
    // Force logout all users from this institution
    const affectedUsers = users.filter(u => u.institutionId === id);
    affectedUsers.forEach(user => {
      forceLogout(user.id);
    });
    
    addToast({
      type: "warning",
      title: "Institution Suspended",
      message: `${institution.name} has been suspended. All ${affectedUsers.length} users have been logged out.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Institution Suspended",
      resource: `Institution #${id}: ${institution.name}`,
      details: `Reason: ${reason}. Users logged out: ${affectedUsers.length}`,
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const resumeInstitution = (id: number) => {
    const institution = institutions.find(i => i.id === id);
    if (!institution) return;

    updateInstitution(id, { status: "active" });
    
    addToast({
      type: "success",
      title: "Institution Resumed",
      message: `${institution.name} has been reactivated and is now operational.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Institution Resumed",
      resource: `Institution #${id}: ${institution.name}`,
      details: "Institution status changed to active",
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const archiveInstitution = (id: number) => {
    const institution = institutions.find(i => i.id === id);
    if (!institution) return;

    updateInstitution(id, { status: "archived" });
    
    addToast({
      type: "info",
      title: "Institution Archived",
      message: `${institution.name} has been archived. Data is preserved and locked.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Institution Archived",
      resource: `Institution #${id}: ${institution.name}`,
      details: "Data preserved, modifications locked",
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const changeInstitutionPlan = (id: number, planId: number) => {
    const institution = institutions.find(i => i.id === id);
    const plan = plans.find(p => p.id === planId);
    if (!institution || !plan) return;

    const oldPlan = institution.plan;
    updateInstitution(id, { plan: plan.name, featuresEnabled: plan.features });
    
    addToast({
      type: "success",
      title: "Plan Changed",
      message: `${institution.name} upgraded from ${oldPlan} to ${plan.name}. Features have been updated.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Plan Changed",
      resource: `Institution #${id}: ${institution.name}`,
      details: `Plan changed from ${oldPlan} to ${plan.name}`,
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const toggleInstitutionFeature = (id: number, feature: string) => {
    const institution = institutions.find(i => i.id === id);
    if (!institution) return;

    const featuresEnabled = institution.featuresEnabled.includes(feature)
      ? institution.featuresEnabled.filter(f => f !== feature)
      : [...institution.featuresEnabled, feature];

    updateInstitution(id, { featuresEnabled });
    
    const action = institution.featuresEnabled.includes(feature) ? "disabled" : "enabled";
    
    addToast({
      type: "info",
      title: "Feature Toggled",
      message: `Feature "${feature}" ${action} for ${institution.name}.`,
    });

    addAuditLog({
      user: currentUser,
      action: `Feature ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      resource: `Institution #${id}: ${institution.name}`,
      details: `Feature: ${feature}`,
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  // ==================== USER ACTIONS ====================
  
  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    
    addAuditLog({
      user: currentUser,
      action: "User Updated",
      resource: `User #${id}`,
      details: JSON.stringify(updates),
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const suspendUser = (id: number, reason: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    updateUser(id, { status: "suspended" });
    forceLogout(id);
    
    addToast({
      type: "warning",
      title: "User Suspended",
      message: `${user.name} has been suspended and logged out.`,
    });

    addAuditLog({
      user: currentUser,
      action: "User Suspended",
      resource: `User #${id}: ${user.email}`,
      details: `Reason: ${reason}`,
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const activateUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    updateUser(id, { status: "active" });
    
    addToast({
      type: "success",
      title: "User Activated",
      message: `${user.name} has been reactivated.`,
    });

    addAuditLog({
      user: currentUser,
      action: "User Activated",
      resource: `User #${id}: ${user.email}`,
      details: "User status changed to active",
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const forceLogout = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    addToast({
      type: "info",
      title: "User Logged Out",
      message: `${user.name} has been forcefully logged out.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Force Logout",
      resource: `User #${id}: ${user.email}`,
      details: "Session terminated by Super Admin",
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const resetUserPassword = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    addToast({
      type: "success",
      title: "Password Reset",
      message: `Password reset email sent to ${user.email}.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Password Reset",
      resource: `User #${id}: ${user.email}`,
      details: "Password reset initiated",
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  // ==================== PLAN ACTIONS ====================
  
  const createPlan = (plan: Omit<Plan, "id">) => {
    addToast({
      type: "success",
      title: "Plan Created",
      message: `Plan "${plan.name}" has been created successfully.`,
    });

    addAuditLog({
      user: currentUser,
      action: "Plan Created",
      resource: `Plan: ${plan.name}`,
      details: JSON.stringify(plan),
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  const updatePlan = (id: number, updates: Partial<Plan>) => {
    addToast({
      type: "success",
      title: "Plan Updated",
      message: "Plan has been updated successfully.",
    });

    addAuditLog({
      user: currentUser,
      action: "Plan Updated",
      resource: `Plan #${id}`,
      details: JSON.stringify(updates),
      ipAddress: "192.168.1.1",
      status: "success",
    });
  };

  // ==================== CONTEXT VALUE ====================
  
  const value: AppContextType = {
    institutions,
    users,
    plans,
    auditLogs,
    createInstitution,
    updateInstitution,
    suspendInstitution,
    resumeInstitution,
    archiveInstitution,
    changeInstitutionPlan,
    toggleInstitutionFeature,
    updateUser,
    suspendUser,
    activateUser,
    forceLogout,
    resetUserPassword,
    createPlan,
    updatePlan,
    addAuditLog,
    toasts,
    addToast,
    removeToast,
    currentUser,
    environment,
  };

  const institutionsValue = {
    institutions,
    createInstitution,
    updateInstitution,
    suspendInstitution,
    resumeInstitution,
    archiveInstitution,
    changeInstitutionPlan,
    toggleInstitutionFeature,
  };

  const usersValue = {
    users,
    updateUser,
    suspendUser,
    activateUser,
    forceLogout,
    resetUserPassword,
  };

  const plansValue = {
    plans,
    createPlan,
    updatePlan,
  };

  const auditValue = {
    auditLogs,
    addAuditLog,
  };

  const toastsValue = {
    toasts,
    addToast,
    removeToast,
  };

  const systemValue = {
    currentUser,
    environment,
  };

  return (
    <SystemProvider value={systemValue}>
      <ToastsProvider value={toastsValue}>
        <AuditProvider value={auditValue}>
          <PlansProvider value={plansValue}>
            <UsersProvider value={usersValue}>
              <InstitutionsProvider value={institutionsValue}>
                <AppContext.Provider value={value}>{children}</AppContext.Provider>
              </InstitutionsProvider>
            </UsersProvider>
          </PlansProvider>
        </AuditProvider>
      </ToastsProvider>
    </SystemProvider>
  );
}

// ==================== HOOK ====================

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}