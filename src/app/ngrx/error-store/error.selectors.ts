
import * as fromError from './error.reducer';
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {ErrorCodes} from "./error.actions";

const selectErrorState = createFeatureSelector<fromError.State>('errors');

export const selectErrorsByCode = createSelector(selectErrorState,
  (state, props: ErrorCodes) => state.errors.find(error => error.code === props));
