import {ActionReducerMap} from "@ngrx/store";
import {EntityState} from "@ngrx/entity";
import {MentorModel} from "./model/mentor.model";
import {CourseModel} from "./model/course.model";
import {LecturerModel} from "./model/lecturer.model";
import {MentorReducer} from "./mentor/mentor.reducer";

import {CandidateModel} from "./model/candidate.model";
import {CandidatesReducer} from "./candidates/candidates.reducer";
import {CoursesReducer} from "./courses/courses.reducer";
import {LecturersReducer} from "./courses/lecturers/lecturers.reducer";

import * as fromErrors from './ngrx/error-store/error.reducer';
import * as fromAuth from './auth/store/auth.reducer';

export interface AppState {
  courses: EntityState<CourseModel>,
  mentors: EntityState<MentorModel>,
  lecturers: EntityState<LecturerModel>,
  candidates: EntityState<CandidateModel>,
  auth: fromAuth.State
  errors: fromErrors.State,
}

const mentorReducer = new MentorReducer();
const candidatesReducer = new CandidatesReducer();
const coursesReducer = new CoursesReducer();
const lecturersReducer = new LecturersReducer();

export const appReducer: ActionReducerMap<AppState> = {
  courses: coursesReducer.reducer.bind(coursesReducer),
  mentors: mentorReducer.reducer.bind(mentorReducer),
  lecturers: lecturersReducer.reducer.bind(lecturersReducer),
  candidates: candidatesReducer.reducer.bind(candidatesReducer),
  auth: fromAuth.reducer,
  errors: fromErrors.reducer
};
