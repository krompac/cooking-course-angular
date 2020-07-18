import {Component, OnDestroy, OnInit} from '@angular/core';
import {MentorModel} from "../../model/mentor.model";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Buttons} from "../../other/alert/alert.component";
import {ServerErrors} from "../../candidates/registration/registration.component";
import {BaseEntityModel} from "../../model/base-entity.model";
import {Store} from "@ngrx/store";
import {MentorReducer} from "../mentor.reducer";
import {CandidatesReducer} from "../../candidates/candidates.reducer";
import {takeUntil} from "rxjs/operators";
import {ErrorCodes} from "../../ngrx/error-store/error.actions";

import * as fromApp from "../../app.reducer";
import * as ErrorActions from "../../ngrx/error-store/error.actions";

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.css']
})
export class MentorComponent implements OnInit, OnDestroy {
  serverErrors: ServerErrors = {};

  mentors: MentorModel[];
  visibleMentors: MentorModel[];

  button: Buttons;
  inputMentor: MentorModel;
  candidatesMentor: MentorModel;
  candidatesMentorChanged = new BehaviorSubject<MentorModel>(null);

  message: string;
  errorMessage: string;
  selectedOption: number;
  mentorIdToDelete: number;

  isEditing: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  isReassigning: boolean;
  isReassigningAll: boolean;
  candidatesOpened: boolean;

  errorSub: Subscription;
  mentorStoreSub: Subscription;

  constructor(private store: Store<fromApp.AppState>, private candidatesReducer: CandidatesReducer, private mentorReducer: MentorReducer) {
  }

  ngOnInit() {
    this.message = null;
    this.errorMessage = null;

    this.inputMentor = null;
    this.candidatesMentor = null;

    this.isEditing = false;
    this.isLoading = false;
    this.isReassigning = false;
    this.isReassigningAll = false;
    this.candidatesOpened = false;

    this.errorSub = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === ErrorCodes.MENTOR);
      if (err) {
        this.handleError(err.errorResponse);
      }
    });

    this.mentorStoreSub = this.store.select(this.mentorReducer.selectAllEntities).subscribe(mentors => {
      this.mentors = mentors;
      this.onCancel();
    })
  }

  onEdit(index: number) {
    this.inputMentor = {...this.visibleMentors[index]};
    this.isEditing = true;
  }

  onAddMentor() {
    this.inputMentor = new MentorModel(null, '', '');
    this.isEditing = true;
  }

  onCancel() {
    this.isLoading = false;
    this.isEditing = false;
    this.inputMentor = null;
  }

  onConfirm() {
    this.isLoading = true;
    if (this.inputMentor.id) {
      this.store.dispatch(this.mentorReducer.entityActions.updateEntityRequest({entity: this.inputMentor}));
    } else {
      this.store.dispatch(this.mentorReducer.entityActions.addEntityRequest({entity: this.inputMentor}));
    }
    this.candidatesOpened = false;
  }

  onCandidates(id: number, mentorIndex: number) {
    if (this.candidatesOpened && this.mentors[mentorIndex].id === this.candidatesMentor.id) {
      this.onCloseCandidates();
    } else {
      this.candidatesMentor = this.visibleMentors[mentorIndex];
      this.candidatesOpened = true;
      this.candidatesMentorChanged.next(this.candidatesMentor);
    }
    this.selectedOption = mentorIndex;
    this.isReassigning = false;
  }

  onDelete(mentor: MentorModel) {
    const candidateUnsub = new Subject<void>();
    this.store.select(this.candidatesReducer.selectAllEntities).pipe(takeUntil(candidateUnsub)).subscribe(candidates => {
      if (candidates.filter(candidate => candidate.mentorId === mentor.id).length > 0) {
        this.message = 'Mentor has assigned candidates, please reassign them';
        this.button = Buttons.Close;
      } else {
        this.isDeleting = true;
        this.message = 'Are you sure you want to delete ' + mentor.firstName + ' ' + mentor.lastName;
        this.button = Buttons.YesNo;
        this.mentorIdToDelete = mentor.id;
      }
      candidateUnsub.next();
    });
  }

  handleAlert(confirmed: boolean) {
    if (confirmed && this.isDeleting) {
      this.isLoading = true;
      this.store.dispatch(this.mentorReducer.entityActions.deleteEntityRequest({id: this.mentorIdToDelete}));
    }

    this.isDeleting = false;
    this.message = null;
  }

  handleError(error) {
    this.isLoading = false;
    const fieldErrors = error.error.errors;
    if (fieldErrors) {
      fieldErrors.forEach(fieldError => {
        if (fieldError.field !== 'id') {
          this.serverErrors[fieldError.field] = '-' + fieldError.defaultMessage.toLowerCase();
        } else {
          this.errorMessage = fieldError.defaultMessage + '!';
        }
      })
    } else {
      this.errorMessage = error.error;
    }

    this.onCancel();
  }

  clearError() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: ErrorCodes.MENTOR}));
  }

  onCloseCandidates() {
    this.candidatesOpened = false;
    this.candidatesMentor = null;
  }

  checkInput() : boolean {
    return this.inputMentor.firstName.trim().length > 0 && this.inputMentor.lastName.trim().length > 0;
  }

  inputChange(inputName: string) {
    delete this.serverErrors[inputName];
  }

  updateVisibleMentors(entities: BaseEntityModel[]) {
    this.visibleMentors = entities as MentorModel[];
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
    this.mentorStoreSub.unsubscribe();
  }

}
