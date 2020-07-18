import {Store} from "@ngrx/store";
import {MentorModel} from "../../model/mentor.model";
import {CandidateModel} from "../../model/candidate.model";
import {CandidatesReducer} from "../../candidates/candidates.reducer";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';

import * as fromApp from "../../app.reducer";

@Component({
  selector: 'app-mentor-candidates',
  templateUrl: './mentor-candidates.component.html',
  styleUrls: ['../component/mentor.component.css', './mentor-candidates.component.css']
})
export class MentorCandidatesComponent implements OnInit, OnDestroy {
  isLoading = false;
  isReassigning: boolean[];
  isReassigningAll: boolean;

  errorMessage: string;
  selectedMentorIndex: number;

  candidates: CandidateModel[];
  reassignCandidate: CandidateModel;
  candidatesMentor: MentorModel;

  @Input() mentors: MentorModel[];
  @Input() mentorChanged: BehaviorSubject<MentorModel>;
  @Output() closeComponent = new Subject<void>();

  mentorChangedSub: Subscription;
  candidatesChangedSub: Subscription;

  constructor(private store: Store<fromApp.AppState>, private candidatesReducer: CandidatesReducer) { }

  ngOnInit() {
    this.errorMessage = null;
    this.candidatesMentor = this.mentorChanged.getValue();
    this.getCandidatesFromMentor(this.candidatesMentor);
    this.mentorChangedSub = this.mentorChanged.subscribe(mentor => {
      this.candidatesMentor = mentor;
      this.getCandidatesFromMentor(mentor)
    });

    this.selectedMentorIndex = this.mentors.indexOf(this.mentors.find(mentor => mentor.id === this.candidatesMentor.id));
  }

  onReassign(candidate: CandidateModel, index: number) {
    this.reassignCandidate = candidate;
    this.isReassigning[index] = true;
    this.isReassigningAll = false;
  }

  onReassignConfirm(index: number) {
    if (this.mentors[this.selectedMentorIndex].id !== this.candidatesMentor.id) {
      this.reassignCandidate.mentorId = this.mentors[this.selectedMentorIndex].id;
      this.candidatesMentor.candidateIds = this.candidatesMentor.candidateIds
        .filter(candidateId => candidateId !== this.reassignCandidate.id);
      this.mentors[this.selectedMentorIndex].candidateIds.push(this.reassignCandidate.id);

      this.isLoading = true;
      this.store.dispatch(this.candidatesReducer.entityActions.updateEntityRequest({entity: this.reassignCandidate}));
      this.isLoading = false;
    }
    this.onCancelReassign(index);
  }

  onCancelReassign(index?: number) {
    this.reassignCandidate = null;
    this.isReassigningAll = false;

    if (index) {
      this.isReassigning[index] = false;
    } else {
      this.isReassigning = new Array(this.candidates.length).fill(false);
    }
  }

  onReassignAll() {
    this.onCancelReassign();
    this.isReassigningAll = true;
  }

  onReassignAllConfirm() {
    this.candidates.forEach(candidate => {
      this.mentors[this.selectedMentorIndex].candidateIds.push(candidate.id);
      candidate.mentorId = this.mentors[this.selectedMentorIndex].id;
    });

    this.candidatesMentor.candidateIds.length = 0;
    this.getCandidatesFromMentor(this.candidatesMentor);

    this.isLoading = true;
    this.store.dispatch(this.candidatesReducer.updateCandidatesRequest({candidates: this.candidates}));
    this.isLoading = false;
  }

  private getCandidatesFromMentor(mentor: MentorModel) {
    this.candidatesChangedSub = this.store.select(this.candidatesReducer.selectAllEntities).subscribe(candidates => {
      this.candidates = candidates.filter(candidate => mentor.candidateIds.includes(candidate.id));
      this.isReassigning = new Array(this.candidates.length).fill(false);
    });
  }

  onCloseCandidates() {
    this.closeComponent.next();
  }

  onCandidates(id: number, index: number) {
    this.mentorChanged.next(this.mentors[index]);
  }

  ngOnDestroy(): void {
    this.mentorChangedSub.unsubscribe();
  }
}
