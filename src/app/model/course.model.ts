import {LecturerModel} from "./lecturer.model";
import {RegistrationModel} from "./registration.model";
import {BaseEntityModel} from "./base-entity.model";

export class CourseModel extends BaseEntityModel{
  name: string;
  type: string;
  numberOfStudents: number;
  lecturers: LecturerModel[] = [];
  registrations: RegistrationModel[] = [];

  constructor(id: number, name: string, type: string, numberOfStudents: number,
              lecturers ?: LecturerModel[],
              registrations ?: RegistrationModel[]) {
    super(id);
    this.name = name;
    this.type = type;
    this.numberOfStudents = numberOfStudents;

    if (lecturers) {
      this.lecturers = lecturers;
    }

    if (registrations) {
      this.registrations = registrations;
    }
  }
}
