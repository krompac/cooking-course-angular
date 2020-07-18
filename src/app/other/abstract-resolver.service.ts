import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BaseEntityModel} from "../model/base-entity.model";
import {Action, Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {EntityReducer} from "../ngrx/entity.reducer";
import {Actions, ofType} from "@ngrx/effects";
import {take, tap} from "rxjs/operators";

import * as fromApp from "../app.reducer";

export class AbstractResolverService<T extends BaseEntityModel> implements Resolve<T[] | Action>{
  didFetch = false;
  private entityReducer: EntityReducer<T>;

  constructor(entityReducer: EntityReducer<T>, public store: Store<fromApp.AppState>, public actions$: Actions) {
    this.entityReducer = entityReducer;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T[] | Action> | T[] {
    if (this.didFetch) {
      return this.store.select(this.entityReducer.selectAllEntities).pipe((take(1)));
    } else {
      this.store.dispatch(this.entityReducer.entityActions.fetchEntities());
      return this.actions$.pipe(ofType(this.entityReducer.entityActions.SET_ENTITIES), take(1),
        tap(() => this.didFetch = true));
    }
  }
}
