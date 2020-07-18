import {switchMap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Effect, ofType} from "@ngrx/effects";
import {CoursesReducer} from "../courses.reducer";
import {EntityEffects} from "../../ngrx/entity.effects";
import {EntityReducer} from "../../ngrx/entity.reducer";
import {LecturerModel} from "../../model/lecturer.model";
import {of} from "rxjs";
import {CourseModel} from "../../model/course.model";

@Injectable()
export class LecturerEffects {

  @Effect()
  fetchLecturers = this.entityEffects.fetchEntities(this.lecturersReducer);

  @Effect()
  addLecturer = this.entityEffects.addEntity(this.lecturersReducer);

  @Effect()
  editLecturer = this.entityEffects.editEntity(this.lecturersReducer);

  @Effect()
  deleteLecturer = this.entityEffects.deleteEntity(this.lecturersReducer);

  @Effect()
  fetchCourses = this.entityEffects.fetchSecondaryEntities<CourseModel>(this.lecturersReducer, 'Course');

  constructor(private entityEffects: EntityEffects<LecturerModel>, private lecturersReducer: LecturersReducer) {}
}


@Injectable({
  providedIn: 'root'
})
export class LecturersReducer extends EntityReducer<LecturerModel> {
  constructor() {
    super('Lecturer')
  }
}
