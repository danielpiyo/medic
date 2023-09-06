import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Locations } from '../../types/type.model';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private _http: HttpClient) {}

  getLocations(): Observable<Locations[]> {
    return this._http.get<Locations[]>(environment.baseURL + '/locations');
  }
}
