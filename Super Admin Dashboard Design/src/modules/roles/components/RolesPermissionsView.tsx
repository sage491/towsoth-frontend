import { Edit, Eye, Lock, Shield, Trash2 } from "lucide-react";
import { PanelHeader } from "../../../components/shared/PanelHeader";
import type { PermissionItem, PermissionGrant, RoleItem } from "../types";

interface RolesPermissionsViewProps {
  roles: RoleItem[];
  permissions: PermissionItem[];
  selectedRole: RoleItem;
  categories: string[];
  onSelectRole: (roleId: RoleItem["id"]) => void;
  getRolePermission: (permissionId: string) => PermissionGrant | undefined;
}

export function RolesPermissionsView({
  roles,
  permissions,
  selectedRole,
  categories,
  onSelectRole,
  getRolePermission,
}: RolesPermissionsViewProps) {
  return (
    <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex">
      <div className="w-72 border-r border-[#d8dce2] flex flex-col bg-white">
        <div className="p-4 border-b border-[#e8eaed]">
          <h2 className="text-[#1f2937] mb-1">Roles</h2>
          <p className="text-[12px] text-[#6b7280]">System role definitions</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`w-full p-4 border-b border-[#e8eaed] text-left hover:bg-[#f5f6f8] transition-colors ${
                selectedRole.id === role.id ? "bg-[#f5f6f8] border-l-2 border-[#1e40af]" : ""
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center ${
                    role.color === "red"
                      ? "bg-red-50"
                      : role.color === "blue"
                        ? "bg-blue-50"
                        : role.color === "green"
                          ? "bg-emerald-50"
                          : "bg-[#f5f6f8]"
                  }`}
                >
                  <Shield
                    className={`w-4 h-4 ${
                      role.color === "red"
                        ? "text-red-600"
                        : role.color === "blue"
                          ? "text-[#1e40af]"
                          : role.color === "green"
                            ? "text-emerald-600"
                            : "text-[#6b7280]"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[13px] text-[#1f2937] mb-0.5 font-medium">{role.name}</h3>
                  <div className="text-[12px] text-[#6b7280]">{role.users.toLocaleString()} users assigned</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-[#e8eaed]">
          <button className="w-full py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
            Create New Role
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title={`${selectedRole.name} Permissions`}
          description="Configure granular access control"
          actions={
            selectedRole.id === "super-admin" ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded">
                <Lock className="w-3.5 h-3.5 text-red-600" />
                <span className="text-[12px] text-red-700 font-medium">System Protected</span>
              </div>
            ) : undefined
          }
        />

        <div className="flex-1 overflow-auto bg-[#f5f6f8]">
          <div className="p-6">
            <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
              <div className="grid grid-cols-4 bg-[#fafbfc] border-b border-[#e8eaed]">
                <div className="p-3 text-[13px] text-[#1f2937] font-medium">Permission</div>
                <div className="p-3 text-[13px] text-[#1f2937] font-medium text-center border-l border-[#e8eaed] flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Read
                </div>
                <div className="p-3 text-[13px] text-[#1f2937] font-medium text-center border-l border-[#e8eaed] flex items-center justify-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Write
                </div>
                <div className="p-3 text-[13px] text-[#1f2937] font-medium text-center border-l border-[#e8eaed] flex items-center justify-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                  Execute
                </div>
              </div>

              {categories.map((category) => (
                <div key={category}>
                  <div className="bg-[#f5f6f8] px-3 py-2 border-b border-[#e8eaed]">
                    <span className="text-[11px] text-[#6b7280] uppercase tracking-wide font-medium">{category}</span>
                  </div>
                  {permissions
                    .filter((permission) => permission.category === category)
                    .map((permission) => {
                      const rolePermission = getRolePermission(permission.id);
                      const isLocked = selectedRole.id === "super-admin";

                      return (
                        <div key={permission.id} className="grid grid-cols-4 border-b border-[#e8eaed] hover:bg-[#fafbfc]">
                          <div className="p-3 text-[13px] text-[#1f2937]">{permission.name}</div>

                          <div className="p-3 flex items-center justify-center border-l border-[#e8eaed]">
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-[#d1d5db]" />
                            ) : (
                              <input
                                type="checkbox"
                                checked={rolePermission?.read || false}
                                className="w-3.5 h-3.5 rounded border-[#d1d5db] bg-white checked:bg-[#1e40af] cursor-pointer"
                                readOnly
                              />
                            )}
                          </div>

                          <div className="p-3 flex items-center justify-center border-l border-[#e8eaed]">
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-[#d1d5db]" />
                            ) : (
                              <input
                                type="checkbox"
                                checked={rolePermission?.write || false}
                                className="w-3.5 h-3.5 rounded border-[#d1d5db] bg-white checked:bg-[#1e40af] cursor-pointer"
                                readOnly
                              />
                            )}
                          </div>

                          <div className="p-3 flex items-center justify-center border-l border-[#e8eaed]">
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-[#d1d5db]" />
                            ) : (
                              <input
                                type="checkbox"
                                checked={rolePermission?.execute || false}
                                className="w-3.5 h-3.5 rounded border-[#d1d5db] bg-white checked:bg-[#1e40af] cursor-pointer"
                                readOnly
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
