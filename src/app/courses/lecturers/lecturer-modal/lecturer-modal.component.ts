import {Subscription} from "rxjs";
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ErrorStateMatcher} from "@angular/material/core";
import {LecturerModel} from "../../../model/lecturer.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ServerErrors} from "../../../candidates/registration/registration.component";
import {Store} from "@ngrx/store";
import {LecturersReducer} from "../lecturers.reducer";

import * as fromApp from "../../../app.reducer";
import * as ErrorActions from "../../../ngrx/error-store/error.actions";

@Component({
  selector: 'app-lecturer-modal',
  templateUrl: './lecturer-modal.component.html',
  styles: []
})
export class LecturerModalComponent implements OnInit, OnDestroy {
  isEdit = false;

  errorMessage: string;
  isLoading: boolean;
  matcher = new ErrorStateMatcher();

  lecturerForm: FormGroup;
  serverErrors: ServerErrors = {};

  errorSubscription: Subscription;

  constructor(public dialogRef: MatDialogRef<LecturerModalComponent>,
              @Inject(MAT_DIALOG_DATA) public lecturer: {id: number, firstName: string, lastName: string},
              public store: Store<fromApp.AppState>, public lecturersReducer: LecturersReducer) { }

  ngOnInit() {
    this.isEdit = !!this.lecturer.id;
    this.lecturerForm = new FormGroup({
      firstName: new FormControl(this.lecturer.firstName, Validators.required),
      lastName: new FormControl(this.lecturer.lastName, Validators.required)
    });

    this.errorSubscription = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === ErrorActions.ErrorCodes.LECTURER);
      if (err) {
        this.handleError(err.errorResponse);
      }
    })
  }

  onSave() {
    this.isLoading = true;

    const lecturerData = new LecturerModel(this.lecturer.id, this.lecturerForm.controls.firstName.value,
      this.lecturerForm.controls.lastName.value, null);

    if (this.isEdit) {
      this.store.dispatch(this.lecturersReducer.entityActions.updateEntityRequest({entity: lecturerData}));
    } else {
      this.store.dispatch(this.lecturersReducer.entityActions.addEntityRequest({entity: lecturerData}));
    }
  }

  handleError(error) {
    const formErrors = error.error.errors;

    if (formErrors) {
      formErrors.forEach(formError => {
        if (this.lecturerForm.contains(formError.field)) {
          this.lecturerForm.get(formError.field).markAsTouched();
          this.lecturerForm.get(formError.field).setErrors({'serverError': true});
          this.serverErrors[formError.field] = formError.defaultMessage + '!';
        } else {
          this.errorMessage = formError.defaultMessage;
        }
      });
    } else {
      this.errorMessage = error.error;
      this.dialogRef.close(this.errorMessage);
    }
    this.isLoading = false;
  }

  clearError() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: ErrorActions.ErrorCodes.LECTURER}));
  }

  getControl(name: string): FormControl {
    return this.lecturerForm.get(name) as FormControl;
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
