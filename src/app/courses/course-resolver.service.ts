import {Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {CoursesReducer} from "./courses.reducer";
import {CourseModel} from "../model/course.model";
import {AbstractResolverService} from "../other/abstract-resolver.service";

import * as fromApp from "../app.reducer";

@Injectable({
  providedIn: 'root'
})
export class CourseResolverService extends AbstractResolverService<CourseModel> {
  constructor(public store: Store<fromApp.AppState>, public actions$: Actions, private coursesReducer: CoursesReducer) {
    super(coursesReducer, store, actions$);
  }
}
