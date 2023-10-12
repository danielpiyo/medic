import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ModalController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SignupService } from 'src/app/shared-resources/auth/signup/signup.service';
import {
  ResendCodePayload,
  SignupPayload,
  VericationCodePayload,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit, OnDestroy {
  @Input() data!: SignupPayload;
  verificationCode: any;
  private dataSubscription!: Subscription;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private _verificationService: SignupService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    console.log(this.data);
  }

  async resend() {
    const loading = await this.showLoading();
    const resendCode: ResendCodePayload = {
      email: this.data.email,
    };
    try {
      this.dataSubscription = this._verificationService
        .resendCode(resendCode)
        .subscribe(
          (res) => {
            console.log(res);
            this.dismissLoading(loading);
            this.presentResendAlert();
          },
          (error) => {
            this.dismissLoading(loading); // Dismiss the loading spinner on error
            this.presentErrorAlert(error.error);
          }
        );
    } catch (error) {
      console.error('Error while displaying/loading spinner:', error);
    }
  }

  async presentResendAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Activation Code resent. Please check your Email!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async submit() {
    const verificationData: VericationCodePayload = {
      reg_code: this.verificationCode,
      email: this.data.email,
    };
    try {
      const loading = await this.showLoading();
      this.dataSubscription = this._verificationService
        .verify(verificationData)
        .subscribe(
          (res) => {
            console.log(res);
            this.dismissLoading(loading);
            this.presentSuccessAlert();
            this.closeModal();
            this.router.navigate(['/signup/onboard-basic'], {
              queryParams: {
                email: this.data.email,
              },
            });
          },
          (error) => {
            this.dismissLoading(loading); // Dismiss the loading spinner on error
            this.presentErrorAlert(error.error);
          }
        );
    } catch (error) {
      console.error('Error while displaying/loading spinner:', error);
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Setting up...',
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
      message: 'Account Created & verified Successfully!',
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

  async closeModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal

    if (openModal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/patient']);
      // Do something else when there is no open modal
      console.log('No open modal found. Doing something else...');
    }
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
