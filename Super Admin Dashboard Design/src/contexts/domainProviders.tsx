import { createContext, useContext, type ReactNode } from "react";
import type {
  AppEnvironment,
  AuditLog,
  Institution,
  NewInstitutionData,
  Plan,
  ToastNotification,
  User,
} from "../types/domain";

export interface InstitutionsContextValue {
  institutions: Institution[];
  createInstitution: (data: NewInstitutionData) => number;
  updateInstitution: (id: number, updates: Partial<Institution>) => void;
  suspendInstitution: (id: number, reason: string) => void;
  resumeInstitution: (id: number) => void;
  archiveInstitution: (id: number) => void;
  changeInstitutionPlan: (id: number, planId: number) => void;
  toggleInstitutionFeature: (id: number, feature: string) => void;
}

export interface UsersContextValue {
  users: User[];
  updateUser: (id: number, updates: Partial<User>) => void;
  suspendUser: (id: number, reason: string) => void;
  activateUser: (id: number) => void;
  forceLogout: (id: number) => void;
  resetUserPassword: (id: number) => void;
}

export interface PlansContextValue {
  plans: Plan[];
  createPlan: (plan: Omit<Plan, "id">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
}

export interface AuditContextValue {
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
}

export interface ToastsContextValue {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, "id">) => void;
  removeToast: (id: string) => void;
}

export interface SystemContextValue {
  currentUser: string;
  environment: AppEnvironment;
}

const InstitutionsContext = createContext<InstitutionsContextValue | undefined>(undefined);
const UsersContext = createContext<UsersContextValue | undefined>(undefined);
const PlansContext = createContext<PlansContextValue | undefined>(undefined);
const AuditContext = createContext<AuditContextValue | undefined>(undefined);
const ToastsContext = createContext<ToastsContextValue | undefined>(undefined);
const SystemContext = createContext<SystemContextValue | undefined>(undefined);

interface DomainProviderProps {
  value:
    | InstitutionsContextValue
    | UsersContextValue
    | PlansContextValue
    | AuditContextValue
    | ToastsContextValue
    | SystemContextValue;
  children: ReactNode;
}

export function InstitutionsProvider({ value, children }: DomainProviderProps) {
  return <InstitutionsContext.Provider value={value as InstitutionsContextValue}>{children}</InstitutionsContext.Provider>;
}

export function UsersProvider({ value, children }: DomainProviderProps) {
  return <UsersContext.Provider value={value as UsersContextValue}>{children}</UsersContext.Provider>;
}

export function PlansProvider({ value, children }: DomainProviderProps) {
  return <PlansContext.Provider value={value as PlansContextValue}>{children}</PlansContext.Provider>;
}

export function AuditProvider({ value, children }: DomainProviderProps) {
  return <AuditContext.Provider value={value as AuditContextValue}>{children}</AuditContext.Provider>;
}

export function ToastsProvider({ value, children }: DomainProviderProps) {
  return <ToastsContext.Provider value={value as ToastsContextValue}>{children}</ToastsContext.Provider>;
}

export function SystemProvider({ value, children }: DomainProviderProps) {
  return <SystemContext.Provider value={value as SystemContextValue}>{children}</SystemContext.Provider>;
}

export function useInstitutionsDomain() {
  const context = useContext(InstitutionsContext);
  if (!context) {
    throw new Error("useInstitutionsDomain must be used within InstitutionsProvider");
  }

  return context;
}

export function useUsersDomain() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersDomain must be used within UsersProvider");
  }

  return context;
}

export function usePlansDomain() {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error("usePlansDomain must be used within PlansProvider");
  }

  return context;
}

export function useAuditDomain() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error("useAuditDomain must be used within AuditProvider");
  }

  return context;
}

export function useToastsDomain() {
  const context = useContext(ToastsContext);
  if (!context) {
    throw new Error("useToastsDomain must be used within ToastsProvider");
  }

  return context;
}

export function useSystemDomain() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystemDomain must be used within SystemProvider");
  }

  return context;
}
