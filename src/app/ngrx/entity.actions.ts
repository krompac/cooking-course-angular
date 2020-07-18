import {BaseEntityModel} from "../model/base-entity.model";
import {ActionCreator, createAction, props} from "@ngrx/store";
import {TypedAction} from "@ngrx/store/src/models";

export class EntityActions<T extends BaseEntityModel> {
  entityName: string;
  entityNamePlural: string;
  entityNameSelector: string;
  entityNamePluralInBraces: string;

  ADD_ENTITY_REQUEST: string;
  ADD_ENTITY_SUCCESS: string;
  UPDATE_ENTITY_REQUEST: string;
  UPDATE_ENTITY_SUCCESS: string;
  DELETE_ENTITY_REQUEST: string;
  DELETE_ENTITY_SUCCESS: string;
  UPDATE_ENTITIES_REQUEST: string;
  SET_ENTITIES: string;
  FETCH_ENTITIES: string;

  addEntityRequest: ActionCreator<string, (props: {entity: T}) => {entity: T} & TypedAction<string>>;
  addEntitySuccess: ActionCreator<string, (props: {entity: T}) => {entity: T} & TypedAction<string>>;
  updateEntityRequest: ActionCreator<string, (props: {entity: T}) => {entity: T} & TypedAction<string>>;
  updateEntitySuccess: ActionCreator<string, (props: {entity: T}) => {entity: T} & TypedAction<string>>;
  deleteEntityRequest: ActionCreator<string, (props: {id: number}) => {id: number} & TypedAction<string>>;
  deleteEntitySuccess: ActionCreator<string, (props: {id: number}) => {id: number} & TypedAction<string>>;
  updateEntitiesRequest: ActionCreator<string, (props: {entities: T[]}) => {entities: T[]} & TypedAction<string>>;
  setEntities: ActionCreator<string, (props: {entities: T[]}) => {entities: T[]} & TypedAction<string>>;
  fetchEntities: ActionCreator<string, () => TypedAction<string>>;


  constructor(entityName: string) {
    this.entityName = entityName.toLowerCase();
    this.entityNamePlural = entityName + 's';
    this.entityNameSelector = this.entityNamePlural.toLowerCase();
    this.entityNamePluralInBraces = '[' + this.entityNamePlural + ']';

    this.ADD_ENTITY_REQUEST = this.entityNamePluralInBraces + ' Add ' + entityName + ' Request';
    this.ADD_ENTITY_SUCCESS = this.entityNamePluralInBraces + ' Add ' + entityName + ' Success';
    this.UPDATE_ENTITY_REQUEST = this.entityNamePluralInBraces + ' Update ' + entityName + ' Request';
    this.UPDATE_ENTITY_SUCCESS = this.entityNamePluralInBraces + ' Update ' + entityName + ' Success';
    this.DELETE_ENTITY_REQUEST = this.entityNamePluralInBraces + ' Delete ' + entityName + ' Request';
    this.DELETE_ENTITY_SUCCESS = this.entityNamePluralInBraces + ' Delete ' + entityName + ' Success';
    this.UPDATE_ENTITIES_REQUEST = this.entityNamePluralInBraces + ' Update ' + this.entityNamePlural + ' Request';
    this.SET_ENTITIES = this.entityNamePluralInBraces + ' Set ' + this.entityNamePlural;
    this.FETCH_ENTITIES = this.entityNamePluralInBraces + ' Fetch ' + this.entityNamePlural;

    this.addEntityRequest = createAction(this.ADD_ENTITY_REQUEST, props<{entity: T}>());
    this.addEntitySuccess = createAction(this.ADD_ENTITY_SUCCESS, props<{entity: T}>());
    this.updateEntityRequest = createAction(this.UPDATE_ENTITY_REQUEST, props<{entity: T}>());
    this.updateEntitySuccess = createAction(this.UPDATE_ENTITY_SUCCESS, props<{entity: T}>());
    this.deleteEntityRequest = createAction(this.DELETE_ENTITY_REQUEST, props<{id: number}>());
    this.deleteEntitySuccess = createAction(this.DELETE_ENTITY_SUCCESS, props<{id: number}>());
    this.updateEntitiesRequest = createAction(this.UPDATE_ENTITIES_REQUEST, props<{entities: T[]}>());
    this.setEntities = createAction(this.SET_ENTITIES, props<{entities: T[]}>());
    this.fetchEntities = createAction(this.FETCH_ENTITIES);
  }
}
