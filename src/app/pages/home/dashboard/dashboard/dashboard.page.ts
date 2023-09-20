import { Component, OnInit } from '@angular/core';
import { AppointmentService } from 'src/app/shared-resources/appointments/appointment.service';
import { Geolocation } from '@capacitor/geolocation';
import {
  AvailabilityPayload,
  User,
  UserToken,
} from 'src/app/shared-resources/types/type.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  toggleState = false;
  coordinates: any;
  currentUser!: User;
  presenation: string = 'appointment';
  currentToken!: string;
  constructor(
    private availabilityService: AppointmentService,
    private toastController: ToastController
  ) {
    this.currentToken = JSON.parse(
      localStorage.getItem('currentToken') || '{}'
    );
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit() {
    this.printCurrentPosition().catch((error) => {
      this.presentLocationToast('bottom');
      console.error('Error getting current position:', error);
    });
  }

  // get Location
  printCurrentPosition = async () => {
    this.coordinates = (await Geolocation.getCurrentPosition()).coords;
    console.log('Current position:', this.coordinates);
  };

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

  sectionAppointment() {
    this.presenation = 'appointment';
  }

  sectionSchedule() {
    this.presenation = 'schedule';
  }

  sectionWallet() {
    this.presenation = 'wallet';
  }
}
