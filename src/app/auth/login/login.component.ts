import {NgForm} from "@angular/forms";
import {UserModel} from "../../model/user.model";
import {HttpClient} from "@angular/common/http";
import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";

import * as fromApp from '../../app.reducer';
import * as AuthActions from '../store/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f', {static: true}) loginForm: NgForm;
  errorMessage: string = null;

  private facebookUri: string;
  private githubUri: string;
  private googleUri: string;

  constructor(private http: HttpClient, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.http.get<{
      facebook: string,
      google: string,
      github: string
    }>('http://localhost:8080/oauth/authorizationUri').subscribe(authorizationUris => {
      this.facebookUri = authorizationUris.facebook;
      this.googleUri = authorizationUris.google;
      this.githubUri = authorizationUris.github;
    });
  }

  onSubmit() {
    const username: string = this.loginForm.value.username;
    const password: string = this.loginForm.value.password;

    if (this.loginForm.invalid || username.trim().length === 0 || password.trim().length === 0) {
      this.errorMessage = 'Please enter valid data';
    } else {
      this.http.post<UserModel>('http://localhost:8080/validateLogin', {username: username, password: password})
        .subscribe(user => this.store.dispatch(AuthActions.login({user}))
          , error => this.errorMessage = error.error);
    }
  }
}
