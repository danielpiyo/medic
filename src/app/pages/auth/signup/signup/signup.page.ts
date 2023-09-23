import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SignupService } from 'src/app/shared-resources/auth/signup/signup.service';
import { SignupPayload } from 'src/app/shared-resources/types/type.model';
import { VerificationPage } from '../verification/verification.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  modelData: any;
  private dataSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _signUpService: SignupService,
    public modalController: ModalController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async signUp() {
    const loading = await this.showLoading();
    if (this.signUpForm.valid) {
      const signUpPayload: SignupPayload = {
        email: this.signUpForm.value.email,
      };
      try {
        this.dataSubscription = this._signUpService
          .signUp(signUpPayload)
          .subscribe(
            (res) => {
              this.dismissLoading(loading);
              this.openVerifyModal(signUpPayload);
              // this.closeModal();
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
  }

  async closeModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal

    if (openModal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/verify']);
      // Do something else when there is no open modal
      console.log('No open modal found. Doing something else...');
    }
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Successfully Signed Up!',
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

  async openLoginModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal
    if (openModal) {
      this.modalController.dismiss();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async openVerifyModal(data: SignupPayload) {
    console.log('Data', data);
    const modalInstance = await this.modalController.create({
      component: VerificationPage,
      componentProps: {
        data: data,
      },
    });
    modalInstance.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modalInstance.present();
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

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
