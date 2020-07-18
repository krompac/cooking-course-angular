import {BaseEntityModel} from "./base-entity.model";

export class PersonModel extends BaseEntityModel{
  firstName: string;
  lastName: string;

  constructor (firstName: string, lastName: string, id ?: number) {
    super(id);
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
