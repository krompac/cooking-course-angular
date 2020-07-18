import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CourseModel} from "../../model/course.model";
import {Subscription} from "rxjs";
import {CoursesReducer} from "../courses.reducer";
import {Store} from "@ngrx/store";

import * as fromApp from "../../app.reducer";

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  @ViewChild('list', {static: true}) listElement: HTMLElement;
  courses: CourseModel[];
  courseSub: Subscription;

  constructor(private coursesReducer: CoursesReducer, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.courseSub = this.store.select(this.coursesReducer.selectAllEntities).subscribe(courses =>{
      this.courses = courses.sort((a, b) => b.registrations.length - a.registrations.length)});
  }

  ngOnDestroy() {
    this.courseSub.unsubscribe();
  }

  checkOverflow() {
    return this.listElement.offsetHeight < this.listElement.scrollHeight ||
      this.listElement.offsetWidth < this.listElement.scrollWidth;
  }
}
