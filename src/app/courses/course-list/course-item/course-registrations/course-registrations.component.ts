import {Component, Inject, OnInit} from '@angular/core';
import {RegistrationModel} from "../../../../model/registration.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Buttons} from "../../../../other/alert/alert.component";

@Component({
  selector: 'app-course-registrations',
  templateUrl: './course-registrations.component.html',
  styleUrls: ['./course-registrations.component.css']
})
export class CourseRegistrationsComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'remove'];
  registrationsToDelete: number[] = [];

  button: Buttons;
  message: string;

  constructor(private dialogRef: MatDialogRef<CourseRegistrationsComponent>,
              @Inject(MAT_DIALOG_DATA) private registrations: RegistrationModel[]) { }

  ngOnInit() {
    this.button = Buttons.YesNo;
  }

  removeRegistration(id: number) {
    this.registrationsToDelete.push(id);
  }

  undoRemove(id: number) {
    this.registrationsToDelete = this.registrationsToDelete.filter(regId => regId !== id);
  }

  onSave() {
    if (this.registrationsToDelete.length > 0) {
      this.message = 'Are you sure you want following candidates to be removed from the course:\n'
        + this.registrations.filter(registration => this.registrationsToDelete.includes(registration.id))
          .map(registration => ' ' + registration.candidate.firstName + ' ' + registration.candidate.lastName).join(',') + '?';
    } else {
      this.dialogRef.close();
    }
  }

  handleAlert(confirmed: boolean) {
    if (confirmed) {
      this.dialogRef.close(this.registrationsToDelete);
    }
    this.message = null;
  }
}
