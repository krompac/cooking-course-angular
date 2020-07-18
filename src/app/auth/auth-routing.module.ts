import {RouterModule, Routes} from "@angular/router";
import {AuthenticatedComponent} from "./authenticated/authenticated.component";
import {AuthenticatedResolverService} from "./authenticated/authenticated-resolver.service";
import {LoginComponent} from "./login/login.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: 'authenticated', children: [
      {path: ':provider', component: AuthenticatedComponent, resolve: {userData: AuthenticatedResolverService}}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
