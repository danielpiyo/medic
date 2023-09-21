import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, Subscription, take, timeout } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
import {
  MyAppointmentDetails,
  UserToken,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.page.html',
  styleUrls: ['./schedules.page.scss'],
})
export class SchedulesPage implements OnInit, OnDestroy {
  openAppointmentLists!: Observable<MyAppointmentDetails[]>;
  originalOpenAppointment: MyAppointmentDetails[] = [];
  filteredOpenAppointment: MyAppointmentDetails[] = [];
  userToken!: UserToken;
  modelData: any;
  targetDate!: Date;
  timeRemaining: string = '';
  appropriateTimeRemaining: any;
  dataOpenSubcription!: Subscription;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.getOpenApponments();
    this.calculateTimeRemaining();
  }

  async ngOnInit() {
    const loading = await this.showLoading();
    setTimeout(() => {
      this.getOpenApponments();
      this.dismissLoading(loading);
    }, 4000);
    setInterval(() => {
      this.calculateTimeRemaining();
    }, 1000);
  }

  async getOpenApponments() {
    const loading = await this.showLoading();
    this.openAppointmentLists = this._appointmentService.getOpenAppointments(
      this.userToken
    );
    this.dataOpenSubcription = this.openAppointmentLists
      .pipe(
        take(1),
        timeout(10000) // Set a timeout of 10 seconds (adjust as needed)
      )
      .subscribe(
        (appointment: any) => {
          this.dismissLoading(loading);
          this.originalOpenAppointment = appointment; // Initialize the original list
          this.filteredOpenAppointment = appointment; // Initialize the filtered list
          console.log('Open Appointment', this.filteredOpenAppointment);
          this.filteredOpenAppointment.forEach((x) => {
            this.targetDate = new Date(x.bookTime);
          });
          // this.targetDate = new Date(this.filteredOpenAppointment[0]?.bookTime);
        },
        (error) => {
          this.dismissLoading(loading);
          console.log(error.error.message);
        }
      );
    // this.dataOpenSubcription = this.openAppointmentLists.subscribe
  }

  calculateTimeRemaining() {
    const currentDate = new Date();
    const timeDifference = this.targetDate?.getTime() - currentDate.getTime();
    this.appropriateTimeRemaining = timeDifference;

    if (timeDifference <= 0) {
      this.timeRemaining = 'Your time is not valid.';
      return;
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    this.timeRemaining = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading ...',
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

  ngOnDestroy(): void {
    if (this.dataOpenSubcription) {
      this.dataOpenSubcription.unsubscribe();
    }
  }
}
