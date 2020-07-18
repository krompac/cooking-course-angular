import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  private _url = 'http://localhost:8080/';

  get url(): string {
    return this._url;
  }

  fetchData<T>(pathVariable: string) {
    return this.http.get<T[]>(this._url + pathVariable);
  }

  saveData<T>(data: T, pathVariable: string) {
    return this.http.post<T>(this._url + pathVariable + '/add', data);
  }

  updateData<T>(data: T, pathVariable: string) {
    return this.http.put<T>(this._url + pathVariable + '/update', data);
  }

  deleteData(pathVariable: string, id: number) {
    return this.http.delete(this._url + pathVariable + '/' + id + '/delete');
  }
}
