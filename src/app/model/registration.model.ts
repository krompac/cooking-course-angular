import {BaseEntityModel} from "./base-entity.model";
import {CandidateModel} from "./candidate.model";

export class RegistrationModel extends BaseEntityModel{
  courses: number[] = [];
  registrationDate: Date;
  candidate: CandidateModel = null;

  constructor(courses: number[], date: Date, id ?: number) {
    super(id);
    this.courses = courses;
    this.registrationDate = date;
  }
}
