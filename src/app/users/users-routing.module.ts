import {RouterModule, Routes} from "@angular/router";
import {UsersComponent} from "./component/users.component";
import {MentorResolverService} from "../mentor/mentor-resolver.service";
import {CandidateResolverService} from "../candidates/candidate-resolver.service";
import {RoleGuard} from "../auth/role.guard";
import {adminRole} from "../app-routing.module";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: '', component: UsersComponent, resolve: [MentorResolverService, CandidateResolverService],
    canActivate: [RoleGuard], data: {role: adminRole}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
