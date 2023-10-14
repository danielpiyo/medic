import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../src/environments/environment';
import {
  InitiateAppointmentPayload,
  MyAppointmentDetails,
  UserToken,
  closeAppointmentPayload,
  withdrawaPayload,
} from '../../types/type.model';
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

  // getBalance
  getNurseBalance(tokenPayload: UserToken) {
    return this._http.post(
      `${environment.baseURL}/doctor/balance`,
      tokenPayload
    );
  }

  initiateAttendance(initatiatePayload: InitiateAppointmentPayload) {
    return this._http.post(
      `${environment.baseURL}/doctorUpdateProgress`,
      initatiatePayload
    );
  }

  closeAppointment(closeAppointPayload: closeAppointmentPayload) {
    return this._http.post(
      `${environment.baseURL}/closeAppointment`,
      closeAppointPayload
    );
  }

  requestWithrawal(requestPayload: withdrawaPayload) {
    return this._http.post(
      `${environment.baseURL}/requestWithrawal`,
      requestPayload
    );
  }

  getMyWithrawal(requestPayload: UserToken) {
    return this._http.post(
      `${environment.baseURL}/myWithrawals`,
      requestPayload
    );
  }
}
