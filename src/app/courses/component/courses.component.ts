import {Component, OnDestroy, OnInit} from '@angular/core';
import * as AuthActions from "../../auth/store/auth.actions";
import {Role} from "../../auth/store/auth.actions";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

import * as fromApp from "../../app.reducer";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  isAuthorized:  boolean;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.authorize({role: Role.ROLE_MENTOR}));
    this.authSub = this.store.select('auth').subscribe(state => this.isAuthorized = state.authorized);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
