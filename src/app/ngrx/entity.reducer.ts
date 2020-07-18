import {BaseEntityModel} from "../model/base-entity.model";
import {
  Action,
  ActionReducer,
  createFeatureSelector,
  createReducer,
  createSelector,
  DefaultProjectorFn,
  MemoizedSelector,
  MemoizedSelectorWithProps,
  on
} from "@ngrx/store";
import {createEntityAdapter, EntityState, Update} from "@ngrx/entity";
import {EntityActions} from "./entity.actions";

export class EntityReducer<T extends BaseEntityModel> {
  entityActions: EntityActions<T>;

  adapter = createEntityAdapter<T>();
  initialState = this.adapter.getInitialState();
  entityReducer: ActionReducer<EntityState<T>, Action>;

  selectEntityState: MemoizedSelector<object, EntityState<T>, DefaultProjectorFn<EntityState<T>>>;
  selectAllEntities: MemoizedSelector<object, T[], DefaultProjectorFn<T[]>>;
  selectEntityById: MemoizedSelectorWithProps<object, {id: number}, T, DefaultProjectorFn<T>>;

  constructor(entityName: string) {
    this.entityActions = new EntityActions<T>(entityName);

    this.entityReducer = createReducer(this.initialState,
      on(this.entityActions.addEntitySuccess, ((state, {entity}) => this.adapter.addOne(entity, state))),
      on(this.entityActions.updateEntitySuccess, ((state, {entity}) => this.updateEntity(entity, state))),
      on(this.entityActions.deleteEntitySuccess, ((state, {id}) => this.adapter.removeOne(id, state))),
      on(this.entityActions.updateEntitiesRequest, ((state, {entities}) => this.updateEntities(entities, state))),
      on(this.entityActions.setEntities, ((state, {entities}) => this.adapter.addAll(entities, state))),
    );

    this.selectEntityState = createFeatureSelector<EntityState<T>>((entityName + 's').toLowerCase());
    this.selectAllEntities = createSelector(this.selectEntityState, this.adapter.getSelectors().selectAll);
    this.selectEntityById = createSelector(this.selectEntityState,
      (state: EntityState<T>, props: {id: number}) => state.entities[props.id]
    );
  }

  updateEntities(entities: T[], state: EntityState<T>) {
    const entityUpdates = entities.map(entity => {
      return {
        id: entity.id,
        changes: {...entity}
      } as Update<T>
    });

    return this.adapter.updateMany(entityUpdates, state);
  }

  updateEntity(entity: T, state: EntityState<T>) {
    const entityUpdate: Update<T> = {
      id: entity.id,
      changes: {...entity}
    };

    return this.adapter.updateOne(entityUpdate, state);
  }

  reducer(state: EntityState<T>, action: Action) {
    return this.entityReducer(state, action);
  }
}
