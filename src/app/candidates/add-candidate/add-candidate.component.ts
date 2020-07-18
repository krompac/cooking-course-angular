import {Subscription} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
import {MentorModel} from "../../model/mentor.model";
import {ActivatedRoute} from "@angular/router";
import {PostService} from "../../other/post.service";
import {CandidateModel} from "../../model/candidate.model";
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ServerErrors} from "../registration/registration.component";
import {MentorReducer} from "../../mentor/mentor.reducer";
import {Store} from "@ngrx/store";
import {CandidatesReducer} from "../candidates.reducer";
import {Location} from "@angular/common";

import * as fromApp from "../../app.reducer";
import * as ErrorActions from "../../ngrx/error-store/error.actions";

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css']
})
export class AddCandidateComponent implements OnInit, OnDestroy {
  @Input() isChildForm = false;
  @Input() singUpForm: FormGroup;
  @Input() editMode = false;
  @Input() serverErrors: ServerErrors = {};
  errorCode = ErrorActions.ErrorCodes.CANDIDATE;

  addCandidateSub: Subscription;
  mentorSub: Subscription;

  availableMentors: MentorModel[];
  errorMessage: string;

  constructor(private route: ActivatedRoute, private candidatesReducer: CandidatesReducer, private location: Location,
              private postService: PostService, private mentorReducer: MentorReducer, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.errorMessage = null;

    const form = new FormGroup({
      id: new FormControl(null),
      firstName: new FormControl(null, [Validators.required, this.isBlank.bind(this)]),
      lastName: new FormControl(null, [Validators.required, this.isBlank.bind(this)]),
      gender: new FormControl('MALE', Validators.required),
      age: new FormControl(null, [Validators.required,
        Validators.pattern('^[1-9]+[0-9]*')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required,
        Validators.pattern('[0-9]{10}')]),
      mentorId: new FormControl(null, Validators.required)
    });

    this.mentorSub = this.store.select(this.mentorReducer.selectAllEntities).pipe(take(1))
      .subscribe(mentors => this.availableMentors = mentors);

    if (!this.editMode) {
      form.patchValue({
        mentorId: this.availableMentors[0].id
      })
    }

    if (this.isChildForm) {
      for (const key of Object.keys(form.controls)) {
        this.singUpForm.addControl(key, form.controls[key]);
      }
    } else {
      this.singUpForm = form;
    }

    if (this.editMode) {
      this.populateForm();
    }

    this.store.select('errors')
      .subscribe(state => {
        const err = state.errors.find(error => error.code === this.errorCode);
        if (err) {
          this.handleError(err.errorResponse);
        }
      })
  }

  onSubmit() {
    const firstName = this.singUpForm.value.firstName;
    const lastName = this.singUpForm.value.lastName;
    const gender = this.singUpForm.value.gender;
    const age = +this.singUpForm.value.age;
    const email = this.singUpForm.value.email;
    const phoneNumber = this.singUpForm.value.phoneNumber;
    const mentorId = this.singUpForm.value.mentorId;

    const candidate = new CandidateModel(firstName, lastName, email, phoneNumber, age, gender, mentorId);
    this.store.dispatch(this.candidatesReducer.entityActions.addEntityRequest({entity: candidate}));
    this.location.back();
  }

  private handleError(error) {
    if (error) {
      const formErrors = error.error.errors;
      if (formErrors) {
        formErrors.forEach(formError => {
          if (this.singUpForm.contains(formError.field)) {
            this.singUpForm.get(formError.field).setErrors({'serverError': true});
            this.serverErrors[formError.field] = '-' + formError.defaultMessage.toLocaleLowerCase()
          } else {
            this.errorMessage = formError.defaultMessage + '!';
          }
        });
      } else {
        this.errorMessage = error.error;
      }
    }
  }

  private populateForm() {
    this.route.params.pipe(take(1), map(params => +params['id']), switchMap(id =>
      this.store.select(this.candidatesReducer.selectEntityById, {id: id})
    )).subscribe((candidateToEdit: CandidateModel) =>
      this.singUpForm.patchValue({
        firstName: candidateToEdit.firstName,
        lastName: candidateToEdit.lastName,
        gender: candidateToEdit.gender,
        age: candidateToEdit.age,
        email: candidateToEdit.email,
        phoneNumber: candidateToEdit.phoneNumber,
        mentorId: candidateToEdit.mentorId
      })
    )
  }

  ngOnDestroy(): void {
    if (this.addCandidateSub) {
      this.addCandidateSub.unsubscribe();
    }

    this.mentorSub.unsubscribe();
  }

  isBlank(control: FormControl) : {[s: string] : boolean} {
    if (control.value && control.value.toString().trim().length === 0) {
      return {'blankInput': true};
    }
    return null;
  }

  clearError() {
    this.store.dispatch(ErrorActions.clearError({code: this.errorCode}));
    this.errorMessage = null;
  }
}
