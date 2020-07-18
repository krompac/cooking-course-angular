import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {Role} from "../auth/store/auth.actions";
import {Component, OnDestroy, OnInit} from '@angular/core';

import * as fromApp from "../app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private currentUserRole: string;
  private isAuthenticated: boolean;
  private isAuthorized: boolean;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.authorize({role: Role.ROLE_ADMIN}));

    this.authSub = this.store.select('auth').subscribe(state => {
      this.isAuthenticated =  !!state.user;
      this.isAuthorized = state.authorized;

      if (this.isAuthenticated) {
        this.currentUserRole = state.user.role.substr(5);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
