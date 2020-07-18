import {Subject, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {NgForm} from "@angular/forms";
import {map, switchMap, take, takeUntil} from "rxjs/operators";
import {CoursesReducer} from "../../courses.reducer";
import {ActivatedRoute, Router} from "@angular/router";
import {CourseModel} from "../../../model/course.model";
import {LecturerModel} from "../../../model/lecturer.model";
import {Buttons} from "../../../other/alert/alert.component";
import {LecturersReducer} from "../../lecturers/lecturers.reducer";
import * as ErrorActions from "../../../ngrx/error-store/error.actions";
import {ErrorCodes} from "../../../ngrx/error-store/error.actions";
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CandidatesReducer} from "../../../candidates/candidates.reducer";
import {ServerErrors} from "../../../candidates/registration/registration.component";

import * as fromApp from "../../../app.reducer";

@Component({
  selector: 'app-course-update',
  templateUrl: './course-modal.component.html',
  styleUrls: ['./course-modal.component.css']
})
export class CourseModalComponent implements OnInit, OnDestroy {
  @ViewChild('courseForm', {static: true}) courseForm: NgForm;

  course: CourseModel;
  currentLecturers: LecturerModel[];
  availableLecturers: LecturerModel[];
  availableLecturersBackup: LecturerModel[];

  button: Buttons;
  message: string;
  errorMessage: string;

  editMode: boolean;
  lecturersAdded: boolean;

  errorSubscription: Subscription;
  routeSubscription: Subscription;

  serverErrors: ServerErrors = {};

  constructor(private lecturersReducer: LecturersReducer, private candidatesReducer: CandidatesReducer,
              private coursesReducer: CoursesReducer, private store: Store<fromApp.AppState>,
              private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.button = Buttons.YesNo;
    this.message = null;

    this.errorSubscription = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === ErrorCodes.COURSE);
      if (err) {
        this.handleError(err.errorResponse);
      }
    });

    this.routeSubscription = this.route.params.pipe(map(params => +params['id']), switchMap(id =>
      this.store.select(this.coursesReducer.selectEntityById, {id: id})), switchMap(course => {
      this.course = course;
      return this.store.select(this.lecturersReducer.selectAllEntities)
    })).pipe(take(1)).subscribe(lecturers => {
      if (this.course) {
        this.editMode = true;

        setTimeout(() => {
          this.courseForm.form.setValue({
            name: this.course.name,
            type: this.course.type,
            numberOfStudents: this.course.numberOfStudents
          })
        });

        const courseLecturerIds = this.course.lecturers.map(courseLecturer => courseLecturer.id);
        this.availableLecturersBackup = lecturers.filter(lecturer => !courseLecturerIds.includes(lecturer.id));
        this.initEditForm();
      } else {
        this.availableLecturersBackup = lecturers;
        this.editMode = false;
        this.initAddForm();
      }
    });
  }

  private initAddForm() {
    setTimeout(() => {
      this.courseForm.form.setValue({
        name: '',
        type: 'BASIC',
        numberOfStudents: 1
      });
    });

    this.currentLecturers = [];
    this.availableLecturers = this.availableLecturersBackup.slice();
  }

  private initEditForm() {
    setTimeout(() => {
      this.courseForm.form.setValue({
        name: this.course.name,
        type: this.course.type,
        numberOfStudents: this.course.numberOfStudents
      });
    });

    this.currentLecturers = this.course.lecturers.slice();
    this.availableLecturers = this.availableLecturersBackup.slice();
  }

  onRemoveLecturer(index: number) {
    this.availableLecturers.push(this.currentLecturers[index]);
    this.currentLecturers.splice(index, 1);
    delete this.serverErrors['lecturers'];
  }

  onAddLecturer(index: number) {
    this.lecturersAdded = true;
    this.currentLecturers.push(this.availableLecturers[index]);
    this.availableLecturers.splice(index, 1);
    delete this.serverErrors['lecturers'];
  }

  onSubmit() {
    this.button = Buttons.Close;

    if (this.editMode) {
      let didChange = false;

      this.currentLecturers.forEach(lecturer => {
        if (!lecturer.courses) {
          lecturer.courses = [];
        } else if (!lecturer.courses.includes(this.course.id)) {
          lecturer.courses.push(this.course.id);
          didChange = true;
        }
      });

      this.availableLecturers.forEach(lecturer => {
        if (lecturer.courses.includes(this.course.id)) {
          lecturer.courses = lecturer.courses.filter(value => value != this.course.id);
          didChange = true;
        }
      });

      this.store.dispatch(this.lecturersReducer.entityActions
        .updateEntitiesRequest({entities: this.currentLecturers.concat(this.availableLecturers)}));

      if (!didChange) {
        const formValueKeys = Object.keys(this.courseForm.value);
        for (const key in this.course) {
          if (formValueKeys.includes(key)) {
            if (this.course[key] !== this.courseForm.value[key]) {
              didChange = true;
              break;
            }
          }
        }
      }

      if (didChange) {
        this.course.name = this.courseForm.value.name;
        this.course.type = this.courseForm.value.type;
        this.course.numberOfStudents = this.courseForm.value.numberOfStudents;
        this.course.lecturers = this.currentLecturers;

        this.store.dispatch(this.coursesReducer.entityActions.addEntityRequest({entity: this.course}));
        this.onClose();
      } else {
        this.onClose();
      }
    } else {
      this.course = this.courseForm.value;
      this.course.lecturers = this.currentLecturers;
      this.course.id = null;
      this.course.registrations = [];
      this.course.lecturers.forEach(lecturer => lecturer.courses.push(this.course.id));

      this.store.dispatch(this.lecturersReducer.entityActions.updateEntitiesRequest({entities: this.course.lecturers}));
      this.store.dispatch(this.coursesReducer.entityActions.addEntityRequest({entity: this.course}));
      this.onClose();
    }
  }

  onReset() {
    if (this.editMode) {
      this.initEditForm();
    } else {
      this.initAddForm();
    }
  }

  onClose() {
    this.router.navigate(['..'], {relativeTo: this.route})
  }

  onDelete() {
    this.button = Buttons.YesNo;
    this.message = 'Are you sure you want to delete this course?';
  }

  deleteCourse(confirm: boolean) {
    this.message = null;
    if (confirm) {
      const containsCourseId = (id: number): boolean => {
        return id !== this.course.id
      };

      this.course.lecturers.forEach(lecturer => {
        lecturer.courses = lecturer.courses.filter(containsCourseId);
      });

      const regIds = this.course.registrations.map(registration => registration.id);
      const editCandidateUnSub = new Subject<void>();
      this.store.select(this.candidatesReducer.selectAllEntities).pipe(takeUntil(editCandidateUnSub)).subscribe(candidates => {
        candidates.filter(candidate => regIds.includes(candidate.registration.id)).forEach(registeredCandidate => {
          registeredCandidate.registration.courses = registeredCandidate.registration.courses.filter(containsCourseId)
        });
        editCandidateUnSub.next();
      });

      this.store.dispatch(this.coursesReducer.entityActions.deleteEntityRequest({id: this.course.id}));
    }
  }

  handleError(error) {
    const formErrors = error.error.errors;
    if (formErrors) {
      formErrors.forEach(formError => {
        if (formError.field !== 'lecturers' && this.courseForm.form.contains(formError.field)) {
          this.courseForm.controls[formError.field].setErrors({'serverError': true});
        } else {
          this.message = formError.defaultMessage + '!';
        }
        this.serverErrors[formError.field] = '-' + formError.defaultMessage.toLowerCase();
      })
    } else {
      this.errorMessage = error.error;
    }
  }

  clearError() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: ErrorCodes.COURSE}));
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

}
