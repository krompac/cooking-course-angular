import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Actions, ofType} from "@ngrx/effects";
import {EntityActions} from "./entity.actions";
import {EntityReducer} from "./entity.reducer";
import {PostService} from "../other/post.service";
import {catchError, map, switchMap} from "rxjs/operators";
import {BaseEntityModel} from "../model/base-entity.model";

import * as ErrorActions from './error-store/error.actions';

@Injectable({
  providedIn: 'root'
})
export class EntityEffects<T extends BaseEntityModel> {

  fetchEntities = (entityReducer: EntityReducer<T>) => {
      return this.actions$.pipe(
        ofType(entityReducer.entityActions.fetchEntities),
        switchMap(() => this.postService.fetchData<T>(entityReducer.entityActions.entityNameSelector)
          .pipe(map(entities => entityReducer.entityActions.setEntities({entities: entities})),
            catchError(err => this.handleError(err, entityReducer))
      )));
  };

  addEntity = (entityReducer: EntityReducer<T>) => {
    return this.actions$.pipe(
      ofType(entityReducer.entityActions.addEntityRequest),
      map(requestValue => requestValue.entity),
      switchMap((entityData: T) => this.postService.saveData<T>(entityData, entityReducer.entityActions.entityName)
        .pipe(map(entity => entityReducer.entityActions.addEntitySuccess({entity})),
          catchError(err => this.handleError(err, entityReducer))
        )))
  };

  editEntity = (entityReducer: EntityReducer<T>) => {
    return this.actions$.pipe(
      ofType(entityReducer.entityActions.updateEntityRequest),
      map(value => value.entity),
      switchMap(updateEntity => this.postService.updateData<T>(updateEntity, entityReducer.entityActions.entityName)
        .pipe(map(entity => entityReducer.entityActions.updateEntitySuccess({entity})),
          catchError(err => this.handleError(err, entityReducer))
        )));
  };

  deleteEntity = (entityReducer: EntityReducer<T>) => {
    return this.actions$.pipe(
      ofType(entityReducer.entityActions.deleteEntityRequest),
      map(value => value.id),
      switchMap(id => this.postService.deleteData(entityReducer.entityActions.entityName, id)
        .pipe(map(() => entityReducer.entityActions.deleteEntitySuccess({id})),
          catchError(err => this.handleError(err, entityReducer))
        )));
  };

  fetchSecondaryEntities = <U extends BaseEntityModel> (entityReducer: EntityReducer<T>, secondaryEntityName: string) => {
    const secondaryActions = new EntityActions<U>(secondaryEntityName);
    return this.actions$.pipe(
      ofType(entityReducer.entityActions.addEntitySuccess, entityReducer.entityActions.updateEntitySuccess,
        entityReducer.entityActions.deleteEntitySuccess),
      switchMap(() => of(secondaryActions.fetchEntities()))
    )
  };

  handleError = (err, entityReducer: EntityReducer<T>) => {
    return of(ErrorActions.setError({entity: entityReducer.entityActions.entityName, errorResponse: err}));
  };

  constructor(public actions$: Actions, public postService: PostService) {
  }
}
