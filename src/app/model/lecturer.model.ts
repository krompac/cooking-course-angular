import {PersonModel} from "./person.model";

export class LecturerModel extends PersonModel{
  courses: number[];

  constructor(id: number, firstName: string, lastName: string, courses: number[]) {
    super(firstName, lastName, id);
    this.courses = courses;
  }
}
