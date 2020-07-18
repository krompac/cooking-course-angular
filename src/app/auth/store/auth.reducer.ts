import {UserModel} from "../../model/user.model";
import {Action, createReducer, on} from "@ngrx/store";

import * as AuthActions from "./auth.actions";
import {Role} from "./auth.actions";

export interface State {
  user: UserModel,
  authorized: boolean
}

const initialState: State = {
  user: null,
  authorized: false
};

const authReducer = createReducer(initialState,
  on(AuthActions.login, ((state, {user}) => {
    return {
      ...state,
      user: user
    }
  })),
  on(AuthActions.logout, (state => {
    return {
      ...state,
      user: null,
      authorized: false
    }
  })),
  on(AuthActions.authorize, ((state, {role}) => {
    return {
      ...state,
      authorized: state.user ? state.user && Role[state.user.role] >= role : false
    }
  }))
);

export function reducer(state: State, action: Action) {
  return authReducer(state, action);
}
