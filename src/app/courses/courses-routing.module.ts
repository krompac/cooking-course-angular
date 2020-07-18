import {RouterModule, Routes} from "@angular/router";
import {CoursesComponent} from "./component/courses.component";
import {CourseResolverService} from "./course-resolver.service";
import {LecturerResolverService} from "./lecturers/lecturer-resolver.service";
import {AuthGuard} from "../auth/auth.guard";
import {LecturersComponent} from "./lecturers/lecturers.component";
import {CourseModalComponent} from "./course-list/course-modal/course-modal.component";
import {RoleGuard} from "../auth/role.guard";
import {CourseItemComponent} from "./course-list/course-item/course-item.component";
import {CandidateResolverService} from "../candidates/candidate-resolver.service";
import {CanDeactivateGaurd} from "./course-list/course-item/can-deactivate.gaurd";
import {mentorRole} from "../app-routing.module";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: '', component: CoursesComponent, resolve: [CourseResolverService, LecturerResolverService],
    canActivate: [AuthGuard], children: [
      {path: '', component: LecturersComponent},
      {path: 'new', component: CourseModalComponent, canActivate: [RoleGuard], data: {role: mentorRole}},
      {path: ':id', component: CourseItemComponent, resolve: [CandidateResolverService], canDeactivate: [CanDeactivateGaurd]},
      {path: ':id/edit', component: CourseModalComponent, canActivate: [RoleGuard], data: {role: mentorRole}}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {

}
