import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SignupService } from 'src/app/shared-resources/auth/signup/signup.service';
import {
  ExperienceOnboardPayload,
  LoginResponse,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
})
export class ExperiencePage implements OnInit, OnDestroy {
  profileFormGroup!: FormGroup;
  UserEmail!: string;
  dataSubscription!: Subscription;
  responseData!: LoginResponse;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
    private onboardService: SignupService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['email']) {
        this.UserEmail = params['email'];
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.profileFormGroup = this.formBuilder.group({
      proffesional_org_name: ['', Validators.required],
      period_from: ['', Validators.required],
      period_to: ['', Validators.required],
      professional_position: ['', Validators.required],
      professional_role: ['', Validators.required],
      accept_terms: [false],
    });
  }

  async addProfessionalData() {
    if (this.profileFormGroup.valid) {
      const experienceDetails: ExperienceOnboardPayload = {
        email: this.UserEmail,
        proffesional_org_name: this.profileFormGroup.get(
          'proffesional_org_name'
        )?.value,
        period_from: this.profileFormGroup.get('period_from')?.value,
        period_to: this.profileFormGroup.get('period_to')?.value,
        professional_position: this.profileFormGroup.get(
          'professional_position'
        )?.value,
        professional_role:
          this.profileFormGroup.get('professional_role')?.value,
        accept_terms: this.profileFormGroup.get('accept_terms')?.value,
      };
      console.log('Details', experienceDetails);

      try {
        const loading = await this.showLoading(); // Display loading spinner

        this.dataSubscription = this.onboardService
          .experienceOnBoard(experienceDetails)
          .subscribe(
            (response: any) => {
              this.dismissLoading(loading); // Dismiss the loading spinner
              this.presentSuccessAlert();
              this.responseData = response;
              console.log(this.responseData);
              if (this.responseData.user) {
                localStorage.setItem(
                  'currentUser',
                  JSON.stringify(this.responseData.user)
                );
              }

              if (this.responseData.token) {
                localStorage.setItem(
                  'currentToken',
                  JSON.stringify(this.responseData.token)
                );
              }

              localStorage.setItem('LoggedIn', 'Yes');
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] ||
                '/home/dashboard';
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

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message:
        'Your profile will go through a review and you will be notified soon.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentErrorAlert(error: Error) {
    const errorMessage = error.message ? error.message : 'Server Error'; // Check if error.message is defined, otherwise use "Server Error"

    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // show Loading
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

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
