import {of} from "rxjs";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../model/user.model";
import {map, switchMap, tap} from "rxjs/operators";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {Role} from "./auth.actions";

import * as AuthActions from "./auth.actions";
import * as fromApp from "../../app.reducer";

@Injectable()
export class AuthEffects {
  // @ts-ignore
  tokenExpirationTimer: NodeJS.Timer;

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    switchMap(() => {
      const user: UserModel = JSON.parse(sessionStorage.getItem('user'));
      return user ? of(AuthActions.login({user})) : of();
    })
  );

  @Effect()
  login = this.actions$.pipe(
    ofType(AuthActions.login),
    map(payload => payload.user),
    switchMap((user: UserModel) => {
      sessionStorage.setItem('user', JSON.stringify(user));
      this.autoLogout(user);
      this.router.navigate(['candidates']);
      return of(AuthActions.authorize({role: Role.ROLE_ADMIN}));
    })
  );

  @Effect({dispatch: false})
  logout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      sessionStorage.removeItem('user');

      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
        this.tokenExpirationTimer = null;
      }

      this.router.navigate(['login']);
    })
  );

  autoLogout = (user: UserModel) => {
    const expirationDuration = (new Date(user.expirationDate)).getTime() - (new Date()).getTime();
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, expirationDuration);
  };

  constructor(private actions$: Actions ,private router: Router, private http: HttpClient, private store: Store<fromApp.AppState>) {}
}
