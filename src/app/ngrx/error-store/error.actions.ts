import {createAction, props} from "@ngrx/store";

export enum ErrorCodes {
  MENTOR,
  CANDIDATE,
  COURSE,
  LECTURER
}

export const SET_ERROR = '[Error] Set Error';
export const CLEAR_ERROR = '[Error] Clear Error';

export const setError = createAction(SET_ERROR, props<{entity: string, errorResponse}>());
export const clearError = createAction(CLEAR_ERROR, props<{code: ErrorCodes}>());
