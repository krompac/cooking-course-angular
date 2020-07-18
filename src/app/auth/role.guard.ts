import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate} from "@angular/router";
import {Role} from "./store/auth.actions";
import {Store} from "@ngrx/store";

import * as fromApp from "../app.reducer";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private store: Store<fromApp.AppState>) {
  }

  canActivate(next: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    const activeRole: Role = Role['ROLE_' + next.data.role];

    return this.store.select('auth').pipe(take(1), map(state => state.user),
      map(user =>
        user && Role[user.role] >= activeRole));
  }
}
