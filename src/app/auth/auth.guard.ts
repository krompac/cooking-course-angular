import {Observable} from "rxjs";
import {map, take} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, UrlTree} from "@angular/router";
import {Store} from "@ngrx/store";

import * as fromApp from "../app.reducer";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(take(1), map(state => state.user),
      map(user => {
        if (user) {
          return true;
        }

        return this.router.createUrlTree(['login']);
    }));
  }
}
