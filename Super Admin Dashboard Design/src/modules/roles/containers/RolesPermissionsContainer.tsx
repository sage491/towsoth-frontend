import { RolesPermissionsView } from "../components/RolesPermissionsView";
import { useRolesPermissions } from "../hooks/useRolesPermissions";

export function RolesPermissionsContainer() {
  const { roles, permissions, selectedRole, categories, setSelectedRoleId, getRolePermission } = useRolesPermissions();

  return (
    <RolesPermissionsView
      roles={roles}
      permissions={permissions}
      selectedRole={selectedRole}
      categories={categories}
      onSelectRole={setSelectedRoleId}
      getRolePermission={getRolePermission}
    />
  );
}
