import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';
import {
  ResetCodePayload,
  ResetPasswordPayload,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {
  email: string = '';
  resetCode: string = '';
  showCodeInput: boolean = false;
  password: string = '';
  confirmPassword: string = '';
  codeResetSubscription!: Subscription;
  passwodResetSubscription!: Subscription;

  constructor(
    private resetService: LoginService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async sendResetCode() {
    const loading = await this.showLoading(); // Display loading spinner
    const resetCodePayload: ResetCodePayload = {
      email: this.email,
    };
    this.codeResetSubscription = this.resetService
      .generateResetCode(resetCodePayload)
      .subscribe(
        (res) => {
          this.dismissLoading(loading);
          this.presentSuccessAlert();
          console.log(res);
          this.showCodeInput = true;
        },
        (error: any) => {
          this.dismissLoading(loading);
          this.presentErrorAlert(error.error);
          this.showCodeInput = false;
        }
      );
  }

  async resetPassword() {
    const loading = await this.showResetLoading();
    if (this.resetCode != null && this.password === this.confirmPassword) {
      const resetPassPayload: ResetPasswordPayload = {
        email: this.email,
        reg_code: this.resetCode,
        password: this.password,
      };
      this.passwodResetSubscription = this.resetService
        .resetPassword(resetPassPayload)
        .subscribe(
          (res) => {
            console.log(res);
            this.dismissLoading(loading);
            this.presentResetSuccessAlert();
            this.router.navigate(['/login']);
            console.log(res);
          },
          (error: any) => {
            this.dismissLoading(loading);
            this.presentErrorAlert(error.error);
            this.showCodeInput = true;
          }
        );
    } else {
      this.presentErrorPaswwordAlert();
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Checking details...',
      spinner: 'bubbles',
    });
    loading.present();
    await loading.present();
    return loading;
  }

  async showResetLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Reseting Password...',
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

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Success, Check your mail for code!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentResetSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Password Reset successfuly',
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

  async presentErrorPaswwordAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: `Error: Your Password Do not match`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // back to Login
  goToLogin() {
    this.router.navigate(['/login']);
  }
  ngOnDestroy(): void {
    if (this.codeResetSubscription) {
      this.codeResetSubscription.unsubscribe();
    } else if (this.passwodResetSubscription) {
      this.passwodResetSubscription.unsubscribe();
    }
  }
}
