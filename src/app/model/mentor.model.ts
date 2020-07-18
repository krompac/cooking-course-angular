import {PersonModel} from "./person.model";

export class MentorModel extends PersonModel{
  candidateIds: number[] = [];

  constructor(public id: number, public firstName: string, public lastName: string) {
    super(firstName, lastName, id);
  }
}
