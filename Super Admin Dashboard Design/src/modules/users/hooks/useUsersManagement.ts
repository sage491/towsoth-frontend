import { useCallback, useEffect, useMemo, useState } from "react";
import { usersService } from "../services/usersService";
import type { UserData, UsersFilters, UsersStats } from "../types";

interface UseUsersManagementResult {
  users: UserData[];
  filteredUsers: UserData[];
  selectedUser: UserData | null;
  filters: UsersFilters;
  stats: UsersStats;
  isLoading: boolean;
  error: string | null;
  setSelectedUser: (user: UserData | null) => void;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: UsersFilters["statusFilter"]) => void;
  setRoleFilter: (value: UsersFilters["roleFilter"]) => void;
  reloadUsers: () => Promise<void>;
}

const DEFAULT_FILTERS: UsersFilters = {
  searchTerm: "",
  statusFilter: "all",
  roleFilter: "all",
};

export function useUsersManagement(): UseUsersManagementResult {
  const [users, setUsers] = useState<UserData[]>(() => usersService.getSeedUsers());
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [filters, setFilters] = useState<UsersFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (loadError: unknown) {
      const message = loadError instanceof Error ? loadError.message : "Failed to load users";
      setError(message);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadUsers(false);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const normalizedSearch = filters.searchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.institution.toLowerCase().includes(normalizedSearch);

      const matchesStatus = filters.statusFilter === "all" || user.status === filters.statusFilter;
      const matchesRole = filters.roleFilter === "all" || user.role === filters.roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [filters.roleFilter, filters.searchTerm, filters.statusFilter, users]);

  const stats = useMemo<UsersStats>(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === "active").length,
      suspended: users.filter((user) => user.status === "suspended").length,
      inactive: users.filter((user) => user.status === "inactive").length,
    };
  }, [users]);

  const setSearchTerm = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  }, []);

  const setStatusFilter = useCallback((value: UsersFilters["statusFilter"]) => {
    setFilters((prev) => ({ ...prev, statusFilter: value }));
  }, []);

  const setRoleFilter = useCallback((value: UsersFilters["roleFilter"]) => {
    setFilters((prev) => ({ ...prev, roleFilter: value }));
  }, []);

  const reloadUsers = useCallback(async () => {
    await loadUsers(true);
  }, [loadUsers]);

  return {
    users,
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
  };
}
