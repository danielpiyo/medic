import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {
  SignupPayload,
  BasicOnboardPayload,
  VericationCodePayload,
  AcademicOnboardPayload,
  ExperienceOnboardPayload,
  ResendCodePayload,
} from '../../types/type.model';
@Injectable({
  providedIn: 'root',
})
export class SignupService {
  constructor(private _http: HttpClient, private router: Router) {}

  signUp(signUpPaylod: SignupPayload): Observable<SignupPayload> {
    return this._http.post<SignupPayload>(
      `${environment.baseURL}/doctorSinup`,
      signUpPaylod
    );
  }

  basicOnBoard(
    onboardPayload: BasicOnboardPayload
  ): Observable<BasicOnboardPayload> {
    return this._http.post<BasicOnboardPayload>(
      `${environment.baseURL}/doctorBasic`,
      onboardPayload
    );
  }

  academicOnBoard(
    academicOnboardPayload: AcademicOnboardPayload
  ): Observable<AcademicOnboardPayload> {
    return this._http.post<AcademicOnboardPayload>(
      `${environment.baseURL}/doctorAcademic`,
      academicOnboardPayload
    );
  }

  experienceOnBoard(
    onboardPayload: ExperienceOnboardPayload
  ): Observable<ExperienceOnboardPayload> {
    return this._http.post<ExperienceOnboardPayload>(
      `${environment.baseURL}/doctorExperince`,
      onboardPayload
    );
  }

  verify(
    verificationData: VericationCodePayload
  ): Observable<VericationCodePayload> {
    return this._http.post<VericationCodePayload>(
      `${environment.baseURL}/doctorVerify`,
      verificationData
    );
  }

  resendCode(resendData: ResendCodePayload): Observable<ResendCodePayload> {
    return this._http.post<ResendCodePayload>(
      `${environment.baseURL}/resendCodeDoctor`,
      resendData
    );
  }
}
