import {NgModule} from "@angular/core";
import {MentorComponent} from "./component/mentor.component";
import {MentorCandidatesComponent} from "./mentor-candidates/mentor-candidates.component";
import {SharedModule} from "../other/shared.module";
import {MentorRoutingModule} from "./mentor-routing.module";

@NgModule({
  declarations: [
    MentorComponent,
    MentorCandidatesComponent
  ],
  imports: [
    SharedModule,
    MentorRoutingModule
  ]
})
export class MentorModule {

}
