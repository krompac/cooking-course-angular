import {FormControl, Validators} from "@angular/forms";
import {ErrorStateMatcher, MAT_DATE_FORMATS} from "@angular/material/core";
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import * as moment from "moment";

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DateTimePickerComponent implements OnInit, OnChanges {
  matcher = new ErrorStateMatcher();
  dateControl = new FormControl(null, [Validators.required, this.hasServerError.bind(this)]);

  @Input() placeholder: string;
  @Input() serverError: string;
  @Input() dateAsText: string;

  @Output() date = new EventEmitter<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.serverError) {
      this.dateControl.markAsTouched();
    }
  }

  ngOnInit() {
    if (this.dateAsText) {
      this.dateControl.patchValue(moment(this.dateAsText));
    }
  }

  handleChange() {
    if (this.dateControl.valid) {
      this.date.emit(moment(this.dateControl.value._d).format('YYYY-MM-DD'));
    }
  }

  hasServerError() : {[s: string] : boolean} {
    if (this.serverError) {
      return {'serverError': true};
    }
    return null;
  }
}
