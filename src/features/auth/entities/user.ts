import { AppUser } from "./app-user";
import { AuthUser } from "./auth-user";

export interface User {
  authUser: AuthUser;
  appUser: AppUser;
}
