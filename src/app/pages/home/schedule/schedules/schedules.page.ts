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
  loading: any;
  dataOpenSubcription!: Subscription;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.getOpenAppointments();
    this.calculateTimeRemaining();
  }

  async ngOnInit() {
    this.loading = await this.showLoading();
    // Initial fetch of open and closed appointments
    this.getOpenAppointments();
    // Periodically fetch open and closed appointments every 6 seconds
    setInterval(() => {
      this.getOpenAppointments();
    }, 6000); // 6000 milliseconds = 6 seconds
    setInterval(() => {
      this.calculateTimeRemaining();
    }, 1000);
  }

  async getOpenAppointments() {
    this.openAppointmentLists = this._appointmentService.getOpenAppointments(
      this.userToken
    );
    this.openAppointmentLists.subscribe(
      (appointment: any) => {
        this.dismissLoading(this.loading);
        this.originalOpenAppointment = appointment;
        this.filteredOpenAppointment = appointment;
        this.filteredOpenAppointment.forEach((x) => {
          this.targetDate = new Date(x.bookTime);
        });
      },
      (error) => {
        this.dismissLoading(this.loading);
        console.log(error.error.message);
      }
    );
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
