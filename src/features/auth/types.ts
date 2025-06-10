export const UserRoles = {
  ADMIN: "admin",
  // USER: "user",
};
export interface AuthUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatarUrl?: string;
  role: UserRolesType;
  // password: string;
}
export type UserRolesType = (typeof UserRoles)[keyof typeof UserRoles];

export interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;

  logout: () => void;
}
