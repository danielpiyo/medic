import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { SignupService } from 'src/app/shared-resources/auth/signup/signup.service';
import { LocationService } from 'src/app/shared-resources/onboard/location/location.service';
import { SpecialitiesService } from 'src/app/shared-resources/onboard/speciality/specialities.service';
import {
  Locations,
  LoginResponse,
  OnboardPayload,
  Speciality,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.page.html',
  styleUrls: ['./basic.page.scss'],
})
export class BasicPage implements OnInit, OnDestroy {
  patientFormGroup!: FormGroup;
  locationsList!: Observable<Locations[]>;
  specialityList!: Observable<Speciality[]>;
  responseData!: LoginResponse;
  UserEmail!: string;
  private dataSubscription!: Subscription;

  constructor(
    private onboardService: SignupService,
    private formBuilder: FormBuilder,
    private _locationService: LocationService,
    private specialityService: SpecialitiesService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private modalContoller: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params['email']) {
        this.UserEmail = params['email'];
      }
    });
    this.getLocations();
    this.initForm();
  }

  initForm() {
    this.patientFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      nid: ['', Validators.required],
      dob: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      location_id: ['', Validators.required],
      gender: ['', Validators.required],
      speciality_id: ['', Validators.required],
    });
  }

  async onBoardPatient() {
    if (
      this.patientFormGroup.valid &&
      this.patientFormGroup.value.confirmPassword ===
        this.patientFormGroup.value.password
    ) {
      const patientDetails: OnboardPayload = {
        name: this.patientFormGroup.get('name')!.value,
        email: this.UserEmail,
        password: this.patientFormGroup.get('password')!.value,
        mobile: this.patientFormGroup.get('mobile')!.value,
        address: this.patientFormGroup.get('address')!.value,
        location_id: this.patientFormGroup.get('location_id')!.value,
      };

      try {
        const loading = await this.showLoading(); // Display loading spinner

        this.dataSubscription = this.onboardService
          .onBoard(patientDetails)
          .subscribe(
            (response: any) => {
              // Data fetching is already handled by subscription
              this.dismissLoading(loading); // Dismiss the loading spinner
              this.presentSuccessAlert();
              this.responseData = response;
              localStorage.setItem(
                'currentUser',
                JSON.stringify(this.responseData.user)
              );
              localStorage.setItem(
                'currentToken',
                JSON.stringify(this.responseData.token)
              );
              localStorage.setItem('LoggedIn', 'Yes');
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/patient/main';
              this.router.navigateByUrl(returnUrl);
            },
            (error: any) => {
              this.dismissLoading(loading); // Dismiss the loading spinner on error
              this.presentErrorAlert(error.error);
            }
          );
      } catch (error) {
        console.error('Error while displaying/loading spinner:', error);
      }
    }
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Submiting Data...',
      spinner: 'bubbles',
    });
    loading.present();
    await loading.present();
    return loading;
  }

  dismissLoading(loading: HTMLIonLoadingElement) {
    if (loading) {
      loading.dismiss();
    }
  }

  getLocations() {
    this.locationsList = this._locationService.getLocations();
  }

  getSpecialities() {
    this.specialityList = this.specialityService.getSpecilities();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Data update succesfully!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorAlert(error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Error: Email already taken`,
      buttons: ['OK'],
    });

    await alert.present();
  }
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
