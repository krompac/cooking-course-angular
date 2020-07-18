import {Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";
import {Injectable} from '@angular/core';
import {LecturersReducer} from "./lecturers.reducer";
import {LecturerModel} from "../../model/lecturer.model";
import {AbstractResolverService} from "../../other/abstract-resolver.service";

import * as fromApp from "../../app.reducer";

@Injectable({
  providedIn: 'root'
})
export class LecturerResolverService extends AbstractResolverService<LecturerModel> {
  constructor(public store: Store<fromApp.AppState>, public actions$: Actions, private lecturersReducer: LecturersReducer) {
    super(lecturersReducer, store, actions$);
  }
}
