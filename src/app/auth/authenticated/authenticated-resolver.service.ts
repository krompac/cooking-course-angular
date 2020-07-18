import {Observable} from "rxjs";
import { Injectable } from '@angular/core';
import {UserModel} from "../../model/user.model";
import {HttpClient} from "@angular/common/http";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedResolverService implements Resolve<UserModel>{

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserModel> {
    const code = route.queryParams['code'];
    const provider = route.params['provider'];

    return this.http.post<UserModel>('http://localhost:8080/oauth/login/' + provider, code);
  }
}
