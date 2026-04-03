export type RoleColor = "red" | "blue" | "green" | "slate";

export interface RoleItem {
  id: "super-admin" | "institution-admin" | "faculty" | "student";
  name: string;
  users: number;
  color: RoleColor;
}

export interface PermissionItem {
  id: string;
  name: string;
  category: string;
}

export interface PermissionGrant {
  id: string;
  read: boolean;
  write: boolean;
  execute: boolean;
}

export type RolePermissionsMap = Record<RoleItem["id"], PermissionGrant[]>;
