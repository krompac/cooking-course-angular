import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {Location} from "@angular/common";
import {map, switchMap} from "rxjs/operators";
import {Component, OnInit} from '@angular/core';
import {CourseModel} from "../../model/course.model";
import {ActivatedRoute, Params} from "@angular/router";
import {CandidatesReducer} from "../candidates.reducer";
import {CandidateModel} from "../../model/candidate.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {CoursesReducer} from "../../courses/courses.reducer";
import {ErrorCodes} from "../../ngrx/error-store/error.actions";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

import * as moment from "moment";
import * as fromApp from "../../app.reducer";
import * as ErrorActions from '../../ngrx/error-store/error.actions';

export interface ServerErrors {
  [key: string]: string
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  candidateForm: FormGroup;
  registrationForm: FormGroup;

  id: number;
  editMode: boolean;
  isLoading: boolean;
  errorMessage: string;
  candidateCourses: number[];
  availableCourses: CourseModel[];
  candidateToEdit: CandidateModel;

  errorSubscription: Subscription;
  courseSubscription: Subscription;
  candidateSubscription: Subscription;

  errorCode = ErrorCodes.CANDIDATE;
  serverErrors: ServerErrors = {};

  constructor(private location: Location, private route: ActivatedRoute, private candidatesReducer: CandidatesReducer,
              private coursesReducer: CoursesReducer, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.editMode = false;
    this.errorMessage = null;
    this.candidateToEdit = null;
    this.candidateCourses = [];

    this.registrationForm = new FormGroup({
      id: new FormControl(null),
      candidate: new FormControl(null),
      registrationDate: new FormControl(null, [Validators.required,
        Validators.pattern('^(19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$')]),
      courses: new FormArray([])
    });

    this.candidateForm = new FormGroup({
      registration: this.registrationForm
    });

    this.candidateSubscription = this.route.params.pipe(map((params: Params) => +params['id']), switchMap(id => {
      this.id = id;
      return this.store.select(this.candidatesReducer.selectEntityById, {id: id})
    })).subscribe(candidate => {
      if (candidate) {
        this.editMode = true;
        this.candidateToEdit = candidate;

        if (this.candidateToEdit.registration) {
          this.populateForm();
        }
      }
      this.isLoading = false;
    });

    this.courseSubscription = this.store.select(this.coursesReducer.selectAllEntities).subscribe(courses =>
      this.availableCourses = courses.sort((a, b) => b.numberOfStudents - a.numberOfStudents)
    );

    this.errorSubscription = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === this.errorCode);
      if (err) {
        this.handleError(err.errorResponse);
      }
    });
  }

  onChecked(event: MatCheckboxChange, index: number) {
    let courses = this.registrationForm.get('courses') as FormArray;

    if (event.checked) {
      courses.push(new FormControl(this.availableCourses[index].id));
    } else {
      let i = 0;
      courses.controls.forEach((control: FormControl) => {
        if (control.value === this.availableCourses[index].id) {
          courses.removeAt(i);
          return;
        }
        i++;
      })
    }

    delete this.serverErrors['registration.courses'];
  }

  onSubmit() {
    if (this.editMode) {
      this.updateRegistration();
    } else {
      this.submitRegistration();
    }
  }

  private updateRegistration() {
    this.candidateForm.patchValue({
      id: this.id
    });

    if (this.formDataChanged()) {
      this.isLoading = true;

      if (this.candidateToEdit.registration != null) {
        const coursesToUpdate = this.candidateToEdit.registration.courses
          .filter(course => !this.registrationForm.value.courses.includes(course))
          .map(courseId => {
            const courseToUpdate = this.availableCourses.find(availableCourse => availableCourse.id === courseId);
            courseToUpdate.numberOfStudents++;
            courseToUpdate.registrations = courseToUpdate.registrations.filter(registration =>
              registration.id !== this.candidateToEdit.registration.id);
            return courseToUpdate;
          });

        this.store.dispatch(this.coursesReducer.entityActions.updateEntitiesRequest({entities: coursesToUpdate}));
      }

      const candidateToUpdate = {...this.candidateForm.value};

      this.store.dispatch(this.candidatesReducer.entityActions.updateEntityRequest({entity: candidateToUpdate}));
      this.isLoading = false;
      this.location.back();
    } else {
      console.log('nothin changed');
    }
  }

  private submitRegistration() {
    this.isLoading = true;

    const candidateToAdd = {...this.candidateForm.value};

    this.store.dispatch(this.candidatesReducer.entityActions.addEntityRequest({entity: candidateToAdd}));
    this.isLoading = false;
    this.location.back();
  }

  private populateForm() {
    this.candidateToEdit.registration.courses.forEach(courseId => {
      (this.registrationForm.get('courses') as FormArray).controls.push(new FormControl(courseId));
      this.candidateCourses.push(courseId);
    });

    this.registrationForm.patchValue({
      id: this.candidateToEdit.registration.id,
      registrationDate: moment(this.candidateToEdit.registration.registrationDate).format('YYYY-MM-DD')
    });
  }

  private formDataChanged(): boolean {
    if (this.candidateToEdit.registration == null) {
      return true;
    }

    const formKeys = Object.keys(this.candidateForm.value);
    let isChanged = false;

    for (const key in this.candidateToEdit) {
      if (formKeys.includes(key)) {
        if (key != 'registration') {
          if (this.candidateToEdit[key] != this.candidateForm.value[key]) {
            isChanged = true;
            break;
          }
        } else {
          const registration = this.candidateToEdit.registration;
          const regFormKeys = Object.keys(this.registrationForm.value);

          for (const key in registration) {
            if (regFormKeys.includes(key)) {
              if (key != 'courses') {
                if (registration[key] != this.registrationForm.value[key]) {
                  isChanged = true;
                  break;
                }
              } else {
                console.log('checkin courses');
                const formArray = (this.registrationForm.get('courses') as FormArray).controls;

                if (formArray.length !== registration.courses.length) {
                  isChanged = true;
                  break;
                } else {
                  for (const control of formArray) {
                    if (!registration.courses.includes(control.value)) {
                      isChanged = true;
                      break;
                    }
                  }

                  if (isChanged) {
                    return isChanged;
                  }
                }
              }
            }
          }
        }
      }

      if (isChanged) {
        break;
      }
    }

    return isChanged;
  }

  private handleError(error) {
    this.candidateForm.markAllAsTouched();
    this.isLoading = false;

    const formErrors = error.error.errors;
    if (formErrors) {
      formErrors.forEach(formError => {
        if ((formError.field as string).includes('registration')) {
          const subStringIndex = 'registration.'.length;
          this.registrationForm.get(formError.field.substring(subStringIndex)).setErrors({'serverError': true});
        } else if (this.candidateForm.contains(formError.field)) {
          setTimeout(() => {
            const candidateFormField = this.candidateForm.get(formError.field);

            candidateFormField.setErrors({'serverError': true});
            candidateFormField.markAsDirty();
            candidateFormField.markAsTouched();
          });
        } else {
          this.errorMessage = formError.defaultMessage + '!';
        }
        let errorText;
        if (formError.field === 'registration.registrationDate') {
          errorText = formError.defaultMessage + '!'
        } else {
          errorText = '-' + formError.defaultMessage.toLowerCase();
        }

        this.serverErrors[formError.field] = errorText;
      });
    } else {
      this.errorMessage = error.error;
    }
  }

  clearError() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: ErrorCodes.CANDIDATE}))
  }

  checkForChecked(course: CourseModel) {
    const formArray = (this.registrationForm.get('courses') as FormArray).controls;
    let checked = false;

    for (let control of formArray) {
      if (course.id === control.value) {
        checked = true;
        break;
      }
    }

    return checked;
  }

  canCheck(course: CourseModel) {
    return !(course.numberOfStudents === 0 && this.candidateCourses.filter(value => course.id === value).length > 0);
  }

  handleDateChange(date: string) {
    this.registrationForm.patchValue({registrationDate: date});
    delete this.serverErrors['registration.registrationDate'];
  }
}
