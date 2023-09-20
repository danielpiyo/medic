import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import { MyAppointmentDetails, UserToken } from '../../types/type.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  constructor(private _http: HttpClient) {}

  getOpenAppointments(
    tokenPayload: UserToken
  ): Observable<MyAppointmentDetails[]> {
    return this._http.post<MyAppointmentDetails[]>(
      `${environment.baseURL}/doctorOpenAppointments`,
      tokenPayload
    );
  }

  // Closed Appointments
  getClosedAppointments(
    tokenPayload: UserToken
  ): Observable<MyAppointmentDetails[]> {
    return this._http.post<MyAppointmentDetails[]>(
      `${environment.baseURL}/doctorClosedAppointments`,
      tokenPayload
    );
  }
}
