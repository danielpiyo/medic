import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/shared-resources/auth/login/login.service';
import {
  AvailabilityPayload,
  CheckAvailabilityPayload,
  CheckAvailabilityResponse,
  User,
} from 'src/app/shared-resources/types/type.model';
import { Geolocation } from '@capacitor/geolocation';
import { AppointmentService } from 'src/app/shared-resources/appointments/appointment.service';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentUser!: User;
  toggleState!: boolean;
  availability: any;
  coordinates: any;
  currentToken!: string;
  private destroy$: Subject<void> = new Subject<void>();
  private subscriptions: Subscription[] = [];

  constructor(
    private _logOutServive: LoginService,
    private _router: Router,
    private availabilityService: AppointmentService,
    private toastController: ToastController
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.currentToken = JSON.parse(
      localStorage.getItem('currentToken') || '{}'
    );
    this.printCurrentPosition().catch((error) => {
      this.presentLocationToast('bottom');
      console.error('Error getting current position:', error);
    });
    this.checkAvailability();
  }

  ngOnInit() {
    console.log('User', this.currentUser);
    this.setupAvailabilityPolling();
  }

  // get Location
  printCurrentPosition = async () => {
    this.coordinates = (await Geolocation.getCurrentPosition()).coords;
    console.log('Current position:', this.coordinates);
  };

  checkAvailability() {
    const checkAvailability: CheckAvailabilityPayload = {
      token: this.currentToken,
    };
    this.availabilityService.checkAvailability(checkAvailability).subscribe(
      (available: any) => {
        console.log(available);
        this.availability = available[0]?.status;
        if (this.availability === 1) {
          this.toggleState = true;
          this.toggleChanged();
        } else {
          this.toggleState = false;
          this.toggleChanged();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setupAvailabilityPolling() {
    // Use takeUntil to automatically unsubscribe when the component is destroyed
    const pollSubscription = interval(30000) // 10000 milliseconds = 10 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkAvailability();
      });

    // Store the pollSubscription in the array
    this.subscriptions.push(pollSubscription);
  }

  toggleChanged() {
    console.log('Toggle state:', this.toggleState);
    const availabilityDetails: AvailabilityPayload = {
      token: this.currentToken,
      lat: this.coordinates.latitude,
      lng: this.coordinates.longitude,
      status: this.toggleState,
    };
    console.log(availabilityDetails);
    this.availabilityService.changeAvailability(availabilityDetails).subscribe(
      (res) => {
        console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  async presentLocationToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Check Your Network or Location if enabled',
      duration: 3500,
      position: position,
    });

    await toast.present();
  }

  logOut() {
    this._logOutServive.logout();
    this._router.navigate(['/login']);
  }

  editProfile() {
    this._router.navigate(['/home/payments']);
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();
  }
}
