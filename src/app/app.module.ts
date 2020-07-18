import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {HeaderComponent} from './header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from "./auth/auth.module";
import {UsersModule} from "./users/users.module";
import {MentorModule} from "./mentor/mentor.module";
import {AppRoutingModule} from "./app-routing.module";
import {CoursesModule} from "./courses/courses.module";
import {SharedModule} from "./other/shared.module";
import {CandidatesModule} from "./candidates/candidates.module";
import {StoreModule} from "@ngrx/store";

import * as fromApp from "./app.reducer";
import {EffectsModule} from "@ngrx/effects";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {environment} from "../environments/environment";
import {MentorEffects} from "./mentor/mentor.reducer";
import {CandidateEffects} from "./candidates/candidates.reducer";
import {LecturerEffects} from "./courses/lecturers/lecturers.reducer";
import {CourseEffects} from "./courses/courses.reducer";
import {AuthEffects} from "./auth/store/auth.effects";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    CandidatesModule,
    CoursesModule,
    MentorModule,
    UsersModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([MentorEffects, CandidateEffects, CourseEffects, LecturerEffects, AuthEffects]),
    StoreDevtoolsModule.instrument({logOnly: environment.production})
  ],
  bootstrap: [AppComponent, HeaderComponent]
})
export class AppModule { }
