import {RegistrationModel} from "./registration.model";
import {PersonModel} from "./person.model";

export class CandidateModel extends PersonModel{
  email: string;

  phoneNumber: string;

  age: number;
  gender: string;

  mentorId: number;
  picture: string = null;

  registration: RegistrationModel = null;

  constructor(
    firstName: string, lastName: string,
    email: string, phoneNumber: string, age: number, gender: string, mentorId ?: number, id ?: number) {
    super(firstName, lastName, id);
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.age = age;
    this.gender = gender;
    this.mentorId = mentorId;
  }
}
