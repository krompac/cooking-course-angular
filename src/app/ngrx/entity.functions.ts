import {BaseEntityModel} from "../model/base-entity.model";
import {EntityAdapter, EntityState, Update} from "@ngrx/entity";

export function updateEntity<E extends BaseEntityModel>(adapter: EntityAdapter<E>, state: EntityState<E>, entity: E) {
  const entityUpdate: Update<E> = {
    id: entity.id,
    changes: {...entity}
  };

  return adapter.updateOne(entityUpdate, state);
}
