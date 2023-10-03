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
    setInterval(() => {
      this.checkAvailability();
    }, 20000); // 6000 milliseconds = 6 seconds
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
      message: 'Enable your Location First',
      duration: 3500,
      position: position,
    });

    await toast.present();
  }

  logOut() {
    this._logOutServive.logout();
    this._router.navigate(['/login']);
  }

  editProfile() {}
}
