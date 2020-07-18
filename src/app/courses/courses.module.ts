import {NgModule} from "@angular/core";
import {SharedModule} from "../other/shared.module";
import {CoursesRoutingModule} from "./courses-routing.module";
import {CoursesComponent} from "./component/courses.component";
import {CourseListComponent} from "./course-list/course-list.component";
import {CourseModalComponent} from "./course-list/course-modal/course-modal.component";
import {CourseItemComponent} from "./course-list/course-item/course-item.component";
import {CourseRegistrationsComponent} from "./course-list/course-item/course-registrations/course-registrations.component";
import {LecturersComponent} from "./lecturers/lecturers.component";
import {LecturerModalComponent} from "./lecturers/lecturer-modal/lecturer-modal.component";

@NgModule({
  declarations: [
    CoursesComponent,
    CourseListComponent,
    CourseModalComponent,
    CourseItemComponent,
    CourseRegistrationsComponent,
    LecturersComponent,
    LecturerModalComponent
  ],
  imports: [SharedModule, CoursesRoutingModule],
  entryComponents: [LecturerModalComponent, CourseRegistrationsComponent]
})
export class CoursesModule {

}
