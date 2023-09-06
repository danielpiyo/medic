import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  SignupPayload,
  OnboardPayload,
  VericationCodePayload,
} from '../../types/type.model';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(private _http: HttpClient, private router: Router) {}

  signUp(signUpPaylod: SignupPayload): Observable<SignupPayload> {
    return this._http.post<SignupPayload>(
      `${environment.baseURL}/signup`,
      signUpPaylod
    );
  }

  onBoard(onboardPayload: OnboardPayload): Observable<OnboardPayload> {
    return this._http.post<OnboardPayload>(
      `${environment.baseURL}/register`,
      onboardPayload
    );
  }

  verify(
    verificationData: VericationCodePayload
  ): Observable<VericationCodePayload> {
    return this._http.post<VericationCodePayload>(
      `${environment.baseURL}/verify`,
      verificationData
    );
  }
}
