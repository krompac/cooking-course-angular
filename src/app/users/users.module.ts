import {NgModule} from "@angular/core";
import {UsersComponent} from "./component/users.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {UsersRoutingModule} from "./users-routing.module";

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    RouterModule,
    UsersRoutingModule
  ]
})
export class UsersModule {

}
