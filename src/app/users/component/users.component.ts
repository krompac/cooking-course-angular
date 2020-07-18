import {Component, OnInit} from '@angular/core';
import {PersonModel} from "../../model/person.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: PersonModel[];

  constructor() { }

  ngOnInit() {
    //TO DO (MAYBE....)
  }
}
