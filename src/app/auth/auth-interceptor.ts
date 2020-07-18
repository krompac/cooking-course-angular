import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {catchError, exhaustMap, map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";

import * as fromApp from "../app.reducer";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store<fromApp.AppState>) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(take(1), map(state => state.user),
      exhaustMap(user => {
        if (user) {
          const header = new HttpHeaders({Authorization: 'Bearer ' + user.token});
          const modifiedReq = request.clone({headers: header});

          return next.handle(modifiedReq);
        } else {
          return next.handle(request);
        }
      }), catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 403) {
            sessionStorage.removeItem('user');
            this.router.navigate(['login']);

            return next.handle(request);
          }
        }
        return throwError(err);
      }));
  }
}
