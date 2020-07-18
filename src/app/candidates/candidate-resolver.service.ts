import {Actions} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {CandidatesReducer} from "./candidates.reducer";
import {CandidateModel} from "../model/candidate.model";
import {AbstractResolverService} from "../other/abstract-resolver.service";

import * as fromApp from "../app.reducer";

@Injectable({
  providedIn: "root"
})
export class CandidateResolverService extends AbstractResolverService<CandidateModel> {
  constructor(private candidatesReducer: CandidatesReducer, public store: Store<fromApp.AppState>, public actions$: Actions) {
    super(candidatesReducer, store, actions$);
  }
}
