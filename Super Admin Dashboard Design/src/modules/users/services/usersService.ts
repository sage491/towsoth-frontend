import { USERS_MOCK_DATA } from "../constants";
import type { UserData } from "../types";

export interface UsersService {
  getSeedUsers: () => UserData[];
  getUsers: () => Promise<UserData[]>;
}

class UsersServiceImpl implements UsersService {
  getSeedUsers(): UserData[] {
    return [...USERS_MOCK_DATA];
  }

  async getUsers(): Promise<UserData[]> {
    return [...USERS_MOCK_DATA];
  }
}

export const usersService: UsersService = new UsersServiceImpl();
