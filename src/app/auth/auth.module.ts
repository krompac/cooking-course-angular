import {NgModule} from "@angular/core";
import {AuthenticatedComponent} from "./authenticated/authenticated.component";
import {LoginComponent} from "./login/login.component";
import {SharedModule} from "../other/shared.module";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthInterceptor} from "./auth-interceptor";
import {AuthRoutingModule} from "./auth-routing.module";

@NgModule({
  declarations: [AuthenticatedComponent, LoginComponent],
  imports: [SharedModule, AuthRoutingModule],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
})
export class AuthModule {

}
