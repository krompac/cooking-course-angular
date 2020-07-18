import {NgModule} from "@angular/core";
import {CandidatesComponent} from "./component/candidates.component";
import {ShowCandidateComponent} from "./show-candidate/show-candidate.component";
import {UploadImageComponent} from "./show-candidate/upload-image/upload-image.component";
import {SharedModule} from "../other/shared.module";
import {CandidatesRoutingModule} from "./candidates-routing.module";
import {RegistrationComponent} from "./registration/registration.component";
import {AddCandidateComponent} from "./add-candidate/add-candidate.component";

@NgModule({
  declarations: [CandidatesComponent, ShowCandidateComponent, UploadImageComponent, RegistrationComponent, AddCandidateComponent],
  imports: [SharedModule, CandidatesRoutingModule]
})
export class CandidatesModule {

}
