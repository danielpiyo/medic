import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { SignupPage } from '../../signup/signup/signup.page';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';
import {
  LoginResponse,
  LoginPayload,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  returnUrl!: string; // Store the returnUrl parameter
  loginForm!: FormGroup;
  loading: boolean = false;
  responseData!: LoginResponse;
  formSubmited: boolean = false;
  signupModal!: HTMLIonModalElement;
  dataSubscription!: Subscription;
  showPassword: boolean = false; // The variable
  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    public modalController: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[^@]*@[^@]*'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false],
    });
  }

  async login() {
    const loading = await this.showLoading(); // Display loading spinner
    this.formSubmited = true;
    const loginFormData = this.loginForm.value;
    const loginPayload: LoginPayload = {
      email: loginFormData.email,
      password: loginFormData.password,
    };
    try {
      this.dataSubscription = this.loginService.logIn(loginPayload).subscribe(
        (response: any) => {
          this.dismissLoading(loading);
          // this.presentSuccessAlert();
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
            this.route.snapshot.queryParams['returnUrl'] || '/home/dashboard';
          this._router.navigateByUrl(returnUrl);
          // this._router.navigate(['/patient']);
          if (this.signupModal) {
            this.signupModal.dismiss();
          }
          this.closeModal();
        },
        (error: any) => {
          this.dismissLoading(loading); // Dismiss the loading spinner on error
          this.presentErrorAlert(error.error);
        }
      );
    } catch (error: any) {
      console.error('Error while displaying/loading spinner:', error);
      this.presentErrorAlert(error.error);
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Signing you in...',
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

  public loghasError = (controlName: string, errorName: string) => {
    // this.loading = false;
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  async closeModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal

    if (openModal) {
      this.modalController.dismiss();
    } else {
      this._router.navigate(['/home/dashboard']);
    }
  }
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'successfully Logged In!',
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

  async openSignUPModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal
    if (openModal) {
      this.modalController.dismiss();
      this._router.navigate(['/signup']);
    } else {
      this._router.navigate(['/signup']);
    }
  }

  // show password
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToForgot() {
    this._router.navigate(['/forgot']);
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
