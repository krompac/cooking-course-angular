import {Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Injectable} from '@angular/core';
import {MentorReducer} from "./mentor.reducer";
import {MentorModel} from "../model/mentor.model";
import {AbstractResolverService} from "../other/abstract-resolver.service";

import * as fromApp from "../app.reducer";

@Injectable({
  providedIn: 'root'
})
export class MentorResolverService extends AbstractResolverService<MentorModel> {
  constructor(public store: Store<fromApp.AppState>, public actions$: Actions, private mentorReducer: MentorReducer) {
    super(mentorReducer, store, actions$);
  }
}
