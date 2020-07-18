import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {CourseModel} from "../../model/course.model";
import {PostService} from "../../other/post.service";
import {CandidatesReducer} from "../candidates.reducer";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CandidateModel} from "../../model/candidate.model";
import {CoursesReducer} from "../../courses/courses.reducer";

import * as fromApp from "../../app.reducer";

@Component({
  selector: 'app-show-candidate',
  templateUrl: './show-candidate.component.html',
  styleUrls: ['./show-candidate.component.css']
})
export class ShowCandidateComponent implements OnInit, OnDestroy {
  isUploading = false;
  isLoading: boolean;
  errorMessage: string;

  courses: CourseModel[];
  candidate: CandidateModel;

  showRegistration: boolean;
  registrationDate: string;

  sub: Subscription;

  constructor(private candidatesReducer: CandidatesReducer, private route: ActivatedRoute,
              private coursesReducer: CoursesReducer, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.isLoading = true;
    this.errorMessage = null;

    this.sub = this.route.params.pipe(map(params => +params['id']), switchMap(id =>
      this.store.select(this.candidatesReducer.selectEntityById, {id: id})), map(candidate => {
        this.candidate = candidate;
        this.isUploading = false;

        this.showRegistration = this.candidate.registration && this.candidate.registration.courses &&
          this.candidate.registration.courses.length > 0;

        return null;
    }), switchMap(() => this.store.select(this.coursesReducer.selectAllEntities))).subscribe(courses => {
      if (this.showRegistration) {
        const regDate = new Date(this.candidate.registration.registrationDate);

        this.registrationDate = [regDate.getDate(), regDate.getMonth() + 1, regDate.getFullYear()].join("-");
        this.courses = courses.filter(course => this.candidate.registration.courses.includes(course.id));
      }

      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onUpload() {
    this.isUploading = true;
  }

  uploadImage(url: string) {
    if (url !== null) {
      this.candidate.picture = url;
      this.store.dispatch(this.candidatesReducer.entityActions.updateEntityRequest({entity: this.candidate}));
    }
  }
}
