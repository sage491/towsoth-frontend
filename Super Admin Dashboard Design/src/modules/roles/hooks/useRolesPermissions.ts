import { useMemo, useState } from "react";
import { PERMISSIONS, ROLE_PERMISSIONS, ROLES, getPermissionCategories } from "../services/rolesService";

export function useRolesPermissions() {
  const [selectedRoleId, setSelectedRoleId] = useState(ROLES[0].id);

  const selectedRole = useMemo(() => {
    return ROLES.find((role) => role.id === selectedRoleId) ?? ROLES[0];
  }, [selectedRoleId]);

  const categories = useMemo(() => {
    return getPermissionCategories(PERMISSIONS);
  }, []);

  const getRolePermission = (permissionId: string) => {
    return ROLE_PERMISSIONS[selectedRole.id].find((permission) => permission.id === permissionId);
  };

  return {
    roles: ROLES,
    permissions: PERMISSIONS,
    selectedRole,
    categories,
    setSelectedRoleId,
    getRolePermission,
  };
}
