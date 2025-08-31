import { UserCreate } from "./userCreate";

export interface CreatedUser {
  token: string;
  userData: UserCreate;
}