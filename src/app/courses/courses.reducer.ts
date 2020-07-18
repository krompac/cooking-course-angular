import {catchError, map, switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Effect, ofType} from "@ngrx/effects";
import {CourseModel} from "../model/course.model";
import {EntityReducer} from "../ngrx/entity.reducer";
import {EntityEffects} from "../ngrx/entity.effects";
import {LecturerModel} from "../model/lecturer.model";
import {createAction, props} from "@ngrx/store";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CourseEffects {
  @Effect()
  fetchCourses = this.entityEffects.fetchEntities(this.coursesReducer);

  @Effect()
  addCourse = this.entityEffects.addEntity(this.coursesReducer);

  @Effect()
  editCourse = this.entityEffects.editEntity(this.coursesReducer);

  @Effect()
  deleteCourse = this.entityEffects.deleteEntity(this.coursesReducer);

  @Effect()
  fetchLecturers = this.entityEffects.fetchSecondaryEntities<LecturerModel>(this.coursesReducer, 'Lecturer');

  @Effect({dispatch: false})
  deleteCourseSuccess = this.entityEffects.actions$.pipe(
    ofType(this.coursesReducer.entityActions.deleteEntitySuccess),
    tap(() => this.router.navigate(['courses']))
  );

  @Effect()
  removeRegistrationsFromCourse = this.entityEffects.actions$.pipe(
    ofType(this.coursesReducer.removeRegistrationFromCourse),
    switchMap(payload => this.http.put('http://localhost:8080/course/deleteFromCourse/'+ payload.course.id, payload.regIds)
      .pipe(map(() => this.coursesReducer.entityActions.updateEntitySuccess({entity: payload.course})),
        catchError(err => this.entityEffects.handleError(err, this.coursesReducer))))
  );


  constructor(private entityEffects: EntityEffects<CourseModel>, private coursesReducer: CoursesReducer,
              private router: Router, private http: HttpClient) {}
}

@Injectable({
  providedIn: 'root'
})
export class CoursesReducer extends EntityReducer<CourseModel> {
  REMOVE_REGISTRATIONS_FROM_COURSE = '[Course] Remove Registrations From Course';
  removeRegistrationFromCourse = createAction(this.REMOVE_REGISTRATIONS_FROM_COURSE, props<{regIds: number[], course: CourseModel}>());

  constructor() {
    super('Course')
  }
}
