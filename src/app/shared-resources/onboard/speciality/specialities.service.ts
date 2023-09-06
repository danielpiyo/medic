import { Injectable } from '@angular/core';
import { Speciality } from '../../types/type.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpecialitiesService {
  constructor(private _http: HttpClient) {}

  getSpecilities(): Observable<Speciality[]> {
    return this._http.get<Speciality[]>(environment.baseURL + '/specialities');
  }
}
