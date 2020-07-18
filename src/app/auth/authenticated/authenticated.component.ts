import {Store} from "@ngrx/store";
import {ActivatedRoute} from "@angular/router";
import {Component, OnInit} from '@angular/core';
import {UserModel} from "../../model/user.model";

import * as fromApp from '../../app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.css']
})
export class AuthenticatedComponent implements OnInit {
  loading: boolean;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.loading = true;
    this.route.data.subscribe(user => {
      const newUser: UserModel = user['userData'];
      this.store.dispatch(AuthActions.login({user: newUser}));
      this.loading = false;
    });
  }
}
