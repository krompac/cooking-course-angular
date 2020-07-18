import {Store} from "@ngrx/store";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import * as AuthActions from "../../../auth/store/auth.actions";
import {Role} from "../../../auth/store/auth.actions";
import {Observable, Subject, Subscription} from "rxjs";
import {CourseModel} from "../../../model/course.model";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Buttons} from "../../../other/alert/alert.component";
import {ActivatedRoute, Router} from "@angular/router";
import {RegistrationModel} from "../../../model/registration.model";
import {CourseRegistrationsComponent} from "./course-registrations/course-registrations.component";

import * as fromApp from "../../../app.reducer";
import {CoursesReducer} from "../../courses.reducer";
import {CandidatesReducer} from "../../../candidates/candidates.reducer";
import {catchError, map, switchMap, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.css']
})
export class CourseItemComponent implements OnInit, OnDestroy {
  button: Buttons;
  alertMessage: string;

  isLoading: boolean;
  isDeleting: boolean;
  changesSaved: boolean;
  isAuthorized: boolean;
  removedRegistrationsIds: number[];

  course: CourseModel;
  registrationToRemove: RegistrationModel;
  courseRegistrations: RegistrationModel[];
  cancelConfirmed = new Subject<boolean>();

  authSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient,
              private store: Store<fromApp.AppState>, private coursesReducer: CoursesReducer,
              private candidatesReducer: CandidatesReducer, private dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(AuthActions.authorize({role: Role.ROLE_MENTOR}));

    this.button = Buttons.YesNo;
    this.alertMessage = null;
    this.isLoading = true;

    this.authSubscription = this.store.select('auth').subscribe(state => this.isAuthorized = state.authorized);

    this.routeSubscription = this.route.params.pipe(map(params => +params['id']), switchMap(id =>
      this.store.select(this.coursesReducer.selectEntityById, {id: id}))).subscribe(course => {
        this.course = course;

        if (this.course) {
          this.courseRegistrations = this.course.registrations.slice();
          this.removedRegistrationsIds = [];
          this.changesSaved = true;
        } else {
          this.router.navigate(['courses']);
        }

        this.isLoading  = false;
    });
  }

  handleAlert(confirmed: boolean) {
    if (this.isDeleting) {
      if (confirmed) {
        this.removeCandidate();
      }
      this.isDeleting = false;
    } else {
      this.cancelConfirmed.next(confirmed);
    }

    this.alertMessage = null;
  }

  removeCandidate() {
    this.removedRegistrationsIds.push(this.registrationToRemove.id);
    this.courseRegistrations = this.courseRegistrations.filter(reg => reg.id != this.registrationToRemove.id);
    this.changesSaved = false;
    this.registrationToRemove = null;
  }

  confirmCancel() : Observable<boolean> | boolean {
    if (this.removedRegistrationsIds.length > 0 && !this.changesSaved) {
      this.alertMessage = 'You didn\'t save your changes, do you want to continue?';
      return this.cancelConfirmed;
    }

    return true;
  }

  onRemoveCandidate(registration: RegistrationModel) {
      this.alertMessage = 'Are you sure you want to remove candidate ' +
      registration.candidate.firstName + ' ' + registration.candidate.lastName + ' from course?';
      this.registrationToRemove = registration;
      this.isDeleting = true;
  }

  saveChanges(removedRegIds: number[]) {
    this.isLoading = true;

    const unsubCandidate = new Subject<void>();
    this.store.select(this.candidatesReducer.selectAllEntities).pipe(takeUntil(unsubCandidate)).subscribe(candidates => {
      candidates.filter(candidate => candidate.registration && removedRegIds.includes(candidate.registration.id)).forEach(candidate =>
        candidate.registration.courses = candidate.registration.courses.filter(courseId => courseId !== this.course.id));
      this.store.dispatch(this.candidatesReducer.entityActions.updateEntitiesRequest({entities: candidates}));
      unsubCandidate.next();
    });

    this.course.registrations = this.course.registrations.filter(registration =>
      !removedRegIds.includes(registration.id));
    this.course.numberOfStudents += removedRegIds.length;
    this.store.dispatch(this.coursesReducer.removeRegistrationFromCourse({regIds:removedRegIds, course: this.course}));
    this.changesSaved = true;
  }

  onCancel() {
    this.ngOnInit();
  }

  openCourseRegistrations() {
    const dialogRef = this.dialog.open(CourseRegistrationsComponent, {
      data: this.courseRegistrations,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.courseRegistrations = this.courseRegistrations.filter(registration => !data.includes(registration.id));
        this.saveChanges(data);
      }
    })
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
