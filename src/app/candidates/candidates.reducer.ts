import {Injectable} from "@angular/core";
import {Effect, ofType} from "@ngrx/effects";
import {createAction, props} from "@ngrx/store";
import {CourseModel} from "../model/course.model";
import {EntityReducer} from "../ngrx/entity.reducer";
import {EntityEffects} from "../ngrx/entity.effects";
import {CandidateModel} from "../model/candidate.model";
import {catchError, map, switchMap, tap} from "rxjs/operators";

@Injectable()
export class CandidateEffects {
  @Effect()
  fetchCandidates = this.entityEffects.fetchEntities(this.candidatesReducer);

  @Effect()
  addCandidate = this.entityEffects.addEntity(this.candidatesReducer);

  @Effect()
  fetchCourses = this.entityEffects.fetchSecondaryEntities<CourseModel>(this.candidatesReducer, 'Course');

  @Effect({dispatch: false})
  setCandidates = this.entityEffects.actions$.pipe(
    ofType(this.candidatesReducer.entityActions.setEntities),
    map(payload => payload.entities),
    tap(candidates => candidates.forEach(candidate => {
      if (candidate.registration && candidate.registration.registrationDate) {
        candidate.registration.registrationDate =
          new Date(candidate.registration.registrationDate.toString().replace(',', '-'))
      }
    }))
  );

  @Effect()
  updateCandidates = this.entityEffects.actions$.pipe(
    ofType(this.candidatesReducer.updateCandidatesRequest),
    switchMap(payload => this.entityEffects.postService.updateData<CandidateModel[]>(payload.candidates, 'candidates')
      .pipe(map(candidates => this.candidatesReducer.entityActions.updateEntitiesRequest({entities: candidates})),
        catchError(err => this.entityEffects.handleError(err, this.candidatesReducer))))
  );

  @Effect()
  editCandidate = this.entityEffects.editEntity(this.candidatesReducer);

  @Effect()
  deleteCandidate = this.entityEffects.deleteEntity(this.candidatesReducer);

  constructor(private entityEffects: EntityEffects<CandidateModel>, private candidatesReducer: CandidatesReducer) {}
}

@Injectable({
  providedIn: 'root'
})
export class CandidatesReducer extends EntityReducer<CandidateModel> {
  UPDATE_CANDIDATES_REQUEST = '[Candidates] Update candidates request';
  updateCandidatesRequest = createAction(this.UPDATE_CANDIDATES_REQUEST, props<{candidates: CandidateModel[]}>());

  constructor() {
    super('Candidate')
  }
}
