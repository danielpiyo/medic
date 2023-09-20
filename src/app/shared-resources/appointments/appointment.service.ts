import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../src/environments/environment';
import {
  AvailabilityPayload,
  MyAppointmentDetails,
  UserToken,
} from '../types/type.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private _http: HttpClient) {}

  changeAvailability(availability: AvailabilityPayload) {
    return this._http.post(
      `${environment.baseURL}/doctorAvailability`,
      availability
    );
  }
}
