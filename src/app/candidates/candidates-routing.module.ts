import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../auth/auth.guard";
import {CandidateResolverService} from "./candidate-resolver.service";
import {CourseResolverService} from "../courses/course-resolver.service";
import {CandidatesComponent} from "./component/candidates.component";
import {AddCandidateComponent} from "./add-candidate/add-candidate.component";
import {MentorResolverService} from "../mentor/mentor-resolver.service";
import {RegistrationComponent} from "./registration/registration.component";
import {RoleGuard} from "../auth/role.guard";
import {ShowCandidateComponent} from "./show-candidate/show-candidate.component";
import {mentorRole} from "../app-routing.module";
import {NgModule} from "@angular/core";

const routes: Routes = [{
  path: '', canActivate: [AuthGuard], resolve: [CandidateResolverService, CourseResolverService], children: [
    {path: '', component: CandidatesComponent},
    {path: 'new', component: AddCandidateComponent, resolve: [MentorResolverService]},
    {
      path: ':id/update', component: RegistrationComponent, resolve: [MentorResolverService],
      canActivate: [RoleGuard], data: {role: mentorRole}
    },
    {path: ':id/show', component: ShowCandidateComponent},
    {
      path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard, RoleGuard],
      resolve: [CourseResolverService, MentorResolverService], data: {role: mentorRole}
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidatesRoutingModule {

}
