import { Search, Filter, User, CheckCircle2, XCircle, Clock, MoreVertical, Mail, Shield, Power, RefreshCw, History } from "lucide-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import type { UserData, UsersFilters, UsersStats } from "../types";

interface UsersViewProps {
  filteredUsers: UserData[];
  selectedUser: UserData | null;
  filters: UsersFilters;
  stats: UsersStats;
  onSelectUser: (user: UserData | null) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: UsersFilters["statusFilter"]) => void;
  onRoleFilterChange: (value: UsersFilters["roleFilter"]) => void;
}

export function UsersView({
  filteredUsers,
  selectedUser,
  filters,
  stats,
  onSelectUser,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
}: UsersViewProps) {
  return (
    <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex flex-col">
      <PageHeader
        title="User Management"
        description="Cross-institution user governance and oversight"
        actions={
          <button className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium">
            Export Users
          </button>
        }
      />

      <div className="p-6 border-b border-[#e8eaed] bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="text-[12px] text-[#6b7280] mb-1">Total Users</div>
              <div className="text-[20px] text-[#1f2937] font-semibold">{stats.total.toLocaleString()}</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="text-[12px] text-[#6b7280] mb-1">Active</div>
              <div className="text-[20px] text-emerald-700 font-semibold">{stats.active}</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="text-[12px] text-[#6b7280] mb-1">Suspended</div>
              <div className="text-[20px] text-amber-700 font-semibold">{stats.suspended}</div>
            </div>
            <div className="bg-[#fafbfc] border border-[#e8eaed] rounded p-3">
              <div className="text-[12px] text-[#6b7280] mb-1">Inactive</div>
              <div className="text-[20px] text-[#6b7280] font-semibold">{stats.inactive}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-4 flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search by name, email, or institution..."
                value={filters.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white border border-[#d8dce2] rounded pl-9 pr-3 py-2 text-[13px] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]"
              />
            </div>
            <select
              value={filters.statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as UsersFilters["statusFilter"])}
              className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={filters.roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              className="bg-white border border-[#d8dce2] rounded px-3 py-2 text-[13px] text-[#1f2937]"
            >
              <option value="all">All Roles</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              More Filters
            </button>
          </div>

          <div className="bg-white border border-[#e8eaed] rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafbfc] border-b border-[#e8eaed]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">User</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Institution</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Last Login</th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#6b7280] font-medium">Activity</th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#6b7280] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8eaed]">
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-[#6b7280]">
                        No users match the current filters.
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#fafbfc] cursor-pointer transition-colors"
                      onClick={() => onSelectUser(user)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-[#e5e7eb] rounded-full flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-[#6b7280]" />
                          </div>
                          <div>
                            <div className="text-[13px] text-[#1f2937] font-medium">{user.name}</div>
                            <div className="text-[12px] text-[#6b7280]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[13px] text-[#1f2937]">{user.institution}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-[#f5f6f8] rounded text-[12px] text-[#1f2937] font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {user.status === "active" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[12px] text-emerald-700 capitalize">{user.status}</span>
                            </>
                          ) : user.status === "suspended" ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              <span className="text-[12px] text-red-700 capitalize">{user.status}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-[#9ca3af]" />
                              <span className="text-[12px] text-[#6b7280] capitalize">{user.status}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] text-[#6b7280]">{user.lastLogin}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            user.activityLevel === "high"
                              ? "bg-emerald-50 text-emerald-700"
                              : user.activityLevel === "medium"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-100 text-[#6b7280]"
                          }`}
                        >
                          {user.activityLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="View Activity">
                            <History className="w-3.5 h-3.5 text-[#6b7280]" />
                          </button>
                          <button className="p-1.5 hover:bg-[#f5f6f8] rounded transition-colors" title="More Actions">
                            <MoreVertical className="w-3.5 h-3.5 text-[#6b7280]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedUser && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={() => onSelectUser(null)}>
              <div className="bg-white rounded border border-[#d8dce2] w-full max-w-2xl m-6" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-[#e8eaed]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#e5e7eb] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#6b7280]" />
                      </div>
                      <div>
                        <h2 className="text-[#1f2937] mb-0.5">{selectedUser.name}</h2>
                        <p className="text-[13px] text-[#6b7280]">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button onClick={() => onSelectUser(null)} className="text-[#6b7280] hover:text-[#1f2937]">
                      ×
                    </button>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Institution</div>
                      <div className="text-[13px] text-[#1f2937]">{selectedUser.institution}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Role</div>
                      <div className="text-[13px] text-[#1f2937]">{selectedUser.role}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Status</div>
                      <div className="text-[13px] text-[#1f2937] capitalize">{selectedUser.status}</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6b7280] mb-1">Created Date</div>
                      <div className="text-[13px] text-[#1f2937]">{selectedUser.createdDate}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e8eaed] flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      Send Message
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Reset Password
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-[#d8dce2] rounded text-[12px] text-[#1f2937] hover:bg-[#f5f6f8] transition-colors">
                      <Shield className="w-3.5 h-3.5" />
                      Change Role
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 rounded text-[12px] text-white hover:bg-red-700 transition-colors">
                      <Power className="w-3.5 h-3.5" />
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
