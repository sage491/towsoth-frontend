import type { PermissionItem, RoleItem, RolePermissionsMap } from "../types";

export const ROLES: RoleItem[] = [
  { id: "super-admin", name: "Super Admin", users: 8, color: "red" },
  { id: "institution-admin", name: "Institution Admin", users: 1247, color: "blue" },
  { id: "faculty", name: "Faculty", users: 18432, color: "green" },
  { id: "student", name: "Student", users: 89342, color: "slate" },
];

export const PERMISSIONS: PermissionItem[] = [
  { id: "view-dashboard", name: "View Dashboard", category: "Dashboard" },
  { id: "view-analytics", name: "View Analytics", category: "Dashboard" },
  { id: "export-data", name: "Export Data", category: "Dashboard" },
  { id: "view-users", name: "View Users", category: "User Management" },
  { id: "create-users", name: "Create Users", category: "User Management" },
  { id: "edit-users", name: "Edit Users", category: "User Management" },
  { id: "delete-users", name: "Delete Users", category: "User Management" },
  { id: "view-content", name: "View Content", category: "Content" },
  { id: "create-content", name: "Create Content", category: "Content" },
  { id: "edit-content", name: "Edit Content", category: "Content" },
  { id: "delete-content", name: "Delete Content", category: "Content" },
  { id: "view-ai-tools", name: "View AI Tools", category: "AI Features" },
  { id: "use-ai-tools", name: "Use AI Tools", category: "AI Features" },
  { id: "configure-ai", name: "Configure AI", category: "AI Features" },
  { id: "view-billing", name: "View Billing", category: "Billing" },
  { id: "manage-billing", name: "Manage Billing", category: "Billing" },
  { id: "view-settings", name: "View Settings", category: "Settings" },
  { id: "edit-settings", name: "Edit Settings", category: "Settings" },
];

export const ROLE_PERMISSIONS: RolePermissionsMap = {
  "super-admin": PERMISSIONS.map((permission) => ({ id: permission.id, read: true, write: true, execute: true })),
  "institution-admin": [
    { id: "view-dashboard", read: true, write: false, execute: false },
    { id: "view-analytics", read: true, write: false, execute: false },
    { id: "export-data", read: true, write: false, execute: true },
    { id: "view-users", read: true, write: false, execute: false },
    { id: "create-users", read: false, write: true, execute: true },
    { id: "edit-users", read: false, write: true, execute: true },
    { id: "delete-users", read: false, write: false, execute: false },
    { id: "view-content", read: true, write: false, execute: false },
    { id: "create-content", read: false, write: true, execute: true },
    { id: "edit-content", read: false, write: true, execute: true },
    { id: "delete-content", read: false, write: true, execute: true },
    { id: "view-ai-tools", read: true, write: false, execute: false },
    { id: "use-ai-tools", read: false, write: false, execute: true },
    { id: "configure-ai", read: false, write: true, execute: true },
    { id: "view-billing", read: true, write: false, execute: false },
    { id: "manage-billing", read: false, write: true, execute: true },
    { id: "view-settings", read: true, write: false, execute: false },
    { id: "edit-settings", read: false, write: true, execute: true },
  ],
  faculty: [
    { id: "view-dashboard", read: true, write: false, execute: false },
    { id: "view-analytics", read: true, write: false, execute: false },
    { id: "view-users", read: true, write: false, execute: false },
    { id: "view-content", read: true, write: false, execute: false },
    { id: "create-content", read: false, write: true, execute: true },
    { id: "edit-content", read: false, write: true, execute: true },
    { id: "view-ai-tools", read: true, write: false, execute: false },
    { id: "use-ai-tools", read: false, write: false, execute: true },
  ],
  student: [
    { id: "view-dashboard", read: true, write: false, execute: false },
    { id: "view-content", read: true, write: false, execute: false },
    { id: "view-ai-tools", read: true, write: false, execute: false },
    { id: "use-ai-tools", read: false, write: false, execute: true },
  ],
};

export function getPermissionCategories(permissions: PermissionItem[]): string[] {
  return Array.from(new Set(permissions.map((permission) => permission.category)));
}
