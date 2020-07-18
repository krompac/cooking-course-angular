import {Subject, Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {take, takeUntil} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {CourseModel} from "../../model/course.model";
import {CandidatesReducer} from "../candidates.reducer";
import {Buttons} from "../../other/alert/alert.component";
import {CandidateModel} from "../../model/candidate.model";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseEntityModel} from "../../model/base-entity.model";
import {CoursesReducer} from "../../courses/courses.reducer";

import * as fromApp from "../../app.reducer";
import * as ErrorActions from '../../ngrx/error-store/error.actions';

@Component({
  selector: 'app-home',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit, OnDestroy {
  candidates: CandidateModel[];
  visibleCandidates: CandidateModel[];

  errorCode = ErrorActions.ErrorCodes.CANDIDATE;
  errorSubscription: Subscription;
  deleteSubscription: Subscription;
  candidateSubscription: Subscription;

  button: Buttons;
  deleteId: number;
  isLoading: boolean;
  deleteMessage: string;
  errorMessage: string;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>,
              private candidatesReducer: CandidatesReducer, private coursesReducer: CoursesReducer) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.button = Buttons.YesNo;
    this.deleteMessage = null;

    this.candidateSubscription = this.store.select(this.candidatesReducer.selectAllEntities).subscribe(candidates => {
      this.candidates = candidates;
    });

    this.errorSubscription = this.store.select('errors').subscribe(state => {
      const err = state.errors.find(error => error.code === this.errorCode);
      if (err && err.errorResponse) {
        this.errorMessage = err.errorResponse.error
      }}
    )}

  ngOnDestroy(): void {
    this.candidateSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onDelete(id: number) {
    this.deleteMessage = 'Are you sure you want to delete this candidate?';
    this.deleteId = id;
  }

  onDeleteConfirm(toDelete: boolean) {
    if (toDelete) {
      this.isLoading = true;
      this.store.dispatch(this.candidatesReducer.entityActions.deleteEntityRequest({id: this.deleteId}));
      this.isLoading = false;
    }

    this.deleteMessage = null;
  }

  handleErrorModal() {
    this.errorMessage = null;
    this.store.dispatch(ErrorActions.clearError({code: this.errorCode}));
    window.location.reload();
  }

  changeVisibleCandidates(entities: BaseEntityModel[]) {
    this.visibleCandidates = entities as CandidateModel[];
  }
}
