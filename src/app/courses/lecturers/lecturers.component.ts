import {Store} from "@ngrx/store";
import {Subject, Subscription} from "rxjs";
import {CoursesReducer} from "../courses.reducer";
import * as AuthActions from "../../auth/store/auth.actions";
import {Role} from "../../auth/store/auth.actions";
import {MatDialog} from "@angular/material/dialog";
import {LecturersReducer} from "./lecturers.reducer";
import {Component, Input, OnInit} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {LecturerModel} from "../../model/lecturer.model";
import {Buttons} from "../../other/alert/alert.component";
import * as ErrorActions from "../../ngrx/error-store/error.actions";
import {ErrorCodes} from "../../ngrx/error-store/error.actions";
import {LecturerModalComponent} from "./lecturer-modal/lecturer-modal.component";
import {ServerErrors} from "../../candidates/registration/registration.component";

import * as fromApp from "../../app.reducer";

@Component({
  selector: 'app-lecturers',
  templateUrl: './lecturers.component.html',
  styleUrls: ['./lecturers.component.css']
})
export class LecturersComponent implements OnInit {
  button: Buttons;
  message: string;
  errorMessage: string;

  isLoading: boolean;
  isDeleting: boolean;
  isAuthorized: boolean;
  @Input() validForm: boolean;

  lecturers: LecturerModel[];
  selectedLecturer: LecturerModel;

  cancelConfirmed = new Subject<boolean>();

  authSub: Subscription;
  errorSub: Subscription;
  lecturerSub: Subscription;

  serverErrors: ServerErrors = {};

  constructor(private lecturersReducer: LecturersReducer, private coursesReducer: CoursesReducer,
              private store: Store<fromApp.AppState>, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.store.dispatch(AuthActions.authorize({role: Role.ROLE_MENTOR}));

    this.message = null;
    this.errorMessage = null;

    this.isDeleting = false;

    this.selectedLecturer = null;

    this.button = Buttons.YesNo;

    this.authSub = this.store.select('auth').subscribe(state => this.isAuthorized = state.authorized);

    this.lecturerSub = this.store.select(this.lecturersReducer.selectAllEntities).subscribe(lecturers => this.lecturers = lecturers);

    this.errorSub = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === ErrorCodes.LECTURER);
      if (err) {
        this.handleError(err.errorResponse);
      }
    })
  }

  onSelected(index: number) {
    this.selectedLecturer = this.lecturers[index];
  }

  onAdd() {
    const dialogRef = this.dialog.open(LecturerModalComponent, {
      width: '250px',
      data: {id: null, firstName: '', lastName: ''}
    });

    dialogRef.afterClosed().subscribe((result: { errorMessage: string }) => {
      if (result) {
        this.errorMessage = result.errorMessage;
      }
    })
  }

  onEdit() {
    const dialogRef = this.dialog.open(LecturerModalComponent, {
      width: '250px',
      data: {
        id: this.selectedLecturer.id,
        firstName: this.selectedLecturer.firstName,
        lastName: this.selectedLecturer.lastName
      }
    });

    dialogRef.afterClosed().subscribe((result: { firstName: string, lastName: string }) => {
      if (result) {
        this.selectedLecturer.firstName = result.firstName;
        this.selectedLecturer.lastName = result.lastName;
        this.isLoading = true;

        this.store.dispatch(this.lecturersReducer.entityActions.updateEntityRequest({entity: this.selectedLecturer}));
      }
    });
  }

  onDelete() {
    this.button = Buttons.YesNo;
    this.message = 'Are you sure you want to delete '
      + this.selectedLecturer.firstName + ' ' + this.selectedLecturer.lastName;
    this.isDeleting = true;
  }

  handleDeleteAlert(confirmed: boolean) {
    if (confirmed && this.isDeleting) {
      this.store.dispatch(this.lecturersReducer.entityActions.deleteEntityRequest({id: this.selectedLecturer.id}));
      this.onCancel();
    } else {
      this.cancelConfirmed.next(confirmed);
      this.message = null;
    }
  }

  handleError(error) {
    this.errorMessage = error.error;
    if (error instanceof HttpErrorResponse && error.status === 400) {
      const courseSub = this.store.select(this.coursesReducer.selectAllEntities).subscribe(courses => {
        this.errorMessage += '\n Courses: ' + courses
          .filter(course => course.lecturers.length === 1 && this.selectedLecturer.courses.includes(course.id))
          .map(course => course.name).join(',');
        courseSub.unsubscribe();
      })
    }

    this.message = null;
  }

  clearError() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: ErrorCodes.LECTURER}));
  }

  onCancel() {
    this.message = null;
    this.selectedLecturer = null;
  }
}
