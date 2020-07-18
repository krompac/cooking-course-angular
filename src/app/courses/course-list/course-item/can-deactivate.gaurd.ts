import {Injectable} from "@angular/core";
import {CourseItemComponent} from "./course-item.component";
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({providedIn: "root"})
export class CanDeactivateGaurd implements CanDeactivate<CourseItemComponent>{

  canDeactivate(component: CourseItemComponent, currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | boolean {
    return component.confirmCancel();
  }
}
