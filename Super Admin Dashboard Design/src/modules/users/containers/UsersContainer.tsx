import { UsersView } from "../components/UsersView";
import { useUsersManagement } from "../hooks/useUsersManagement";

export function UsersContainer() {
  const {
    filteredUsers,
    selectedUser,
    filters,
    stats,
    isLoading,
    error,
    setSelectedUser,
    setSearchTerm,
    setStatusFilter,
    setRoleFilter,
    reloadUsers,
  } = useUsersManagement();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-[13px] text-[#6b7280]">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-hidden bg-[#f5f6f8] flex items-center justify-center p-6">
        <div className="bg-white border border-[#e8eaed] rounded p-5 max-w-md w-full text-center">
          <div className="text-[14px] text-[#1f2937] mb-2">Unable to load users</div>
          <div className="text-[12px] text-[#6b7280] mb-4">{error}</div>
          <button
            onClick={() => void reloadUsers()}
            className="px-3 py-2 bg-[#1e40af] rounded text-[12px] text-white hover:bg-[#1e3a8a] transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <UsersView
      filteredUsers={filteredUsers}
      selectedUser={selectedUser}
      filters={filters}
      stats={stats}
      onSelectUser={setSelectedUser}
      onSearchChange={setSearchTerm}
      onStatusFilterChange={setStatusFilter}
      onRoleFilterChange={setRoleFilter}
    />
  );
}
