import {createAction, props} from "@ngrx/store";
import {UserModel} from "../../model/user.model";

export enum Role {
  ROLE_USER,
  ROLE_MENTOR,
  ROLE_ADMIN
}

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const AUTHORIZE = '[Auth] Authorize';

export const login = createAction(LOGIN, props<{ user: UserModel }>());
export const logout = createAction(LOGOUT);
export const autoLogin = createAction(AUTO_LOGIN);
export const authorize = createAction(AUTHORIZE, props<{ role: Role }>());
