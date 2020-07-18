import {Action, createReducer, on} from "@ngrx/store";
import * as ErrorActions from "./error.actions";
import {ErrorCodes} from "./error.actions";

interface Error {
  code: ErrorCodes,
  errorResponse
}

export interface State {
  errors: Error[]
}

const initialState: State = {
  errors: []
};

const errorReducer = createReducer(initialState,
  on(ErrorActions.setError, ((state, {entity, errorResponse}) => {
    let code: ErrorCodes;
    switch (entity) {
      case 'Course':
        code = ErrorCodes.COURSE;
        break;
      case 'Candidate':
        code = ErrorCodes.CANDIDATE;
        break;
      case 'Mentor':
        code = ErrorCodes.MENTOR;
        break;
      case 'Lecturer':
        code = ErrorCodes.LECTURER;
        break;
    }

    const newErrors = state.errors.filter(error => error.code !== code);
    newErrors.push({code: code, errorResponse: errorResponse});

    return {
      ...state,
      errors: newErrors
    }
  })),
  on(ErrorActions.clearError, ((state, {code}) => {
    return {
      ...state,
      errors: state.errors.filter(error => error.code !== code)
    }
  }))
);

export function reducer(state: State, action: Action) {
  return errorReducer(state, action);
}
