import {RouterModule, Routes} from "@angular/router";
import {MentorComponent} from "./component/mentor.component";
import {MentorResolverService} from "./mentor-resolver.service";
import {RoleGuard} from "../auth/role.guard";
import {adminRole} from "../app-routing.module";
import {NgModule} from "@angular/core";

const routes: Routes = [{
  path: '', component: MentorComponent, resolve: [MentorResolverService], canActivate: [RoleGuard],
    data: {role: adminRole}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRoutingModule {

}
