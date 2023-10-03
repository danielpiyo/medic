import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, Subscription, take, timeout } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;
import {
  MyAppointmentDetails,
  UserToken,
} from 'src/app/shared-resources/types/type.model';
import { AppointmentDetailsPage } from '../appointmentDetails/appointment-details/appointment-details.page';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {
  closedAppointmentLists!: Observable<MyAppointmentDetails[]>;
  openAppointmentLists!: Observable<MyAppointmentDetails[]>;
  originalOpenAppointment: MyAppointmentDetails[] = [];
  filteredOpenAppointment: MyAppointmentDetails[] = [];
  originalClosedAppointment: MyAppointmentDetails[] = [];
  filteredClosedAppointment: MyAppointmentDetails[] = [];
  dataOpenSubcription!: Subscription;
  dataClosedSubcription!: Subscription;
  userToken!: UserToken;
  modelData: any;
  loading: any;
  targetDate!: Date;
  timeRemaining: string = '';
  appropriateTimeRemaining: any;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController,
    private modalController: ModalController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.getOpenAppointments();
    this.getClosedAppointments();
  }

  async ngOnInit() {
    this.loading = await this.showLoading();
    // Initial fetch of open and closed appointments
    this.getOpenAppointments();
    this.getClosedAppointments();
    // Periodically fetch open and closed appointments every 6 seconds
    setInterval(() => {
      this.getOpenAppointments();
      this.getClosedAppointments();
    }, 6000); // 6000 milliseconds = 6 seconds
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
        this.targetDate = new Date(this.filteredOpenAppointment[0]?.bookTime);
        // console.log('MyTarget', this.targetDate);
        this.calculateTimeRemaining();
        this.showAppointmentNotification();
      },
      (error) => {
        this.dismissLoading(this.loading);
        console.log(error.error.message);
      }
    );
  }

  async getClosedAppointments() {
    this.closedAppointmentLists =
      this._appointmentService.getClosedAppointments(this.userToken);
    this.closedAppointmentLists.subscribe(
      (appointment: any) => {
        this.dismissLoading(this.loading);
        this.originalClosedAppointment = appointment;
        this.filteredClosedAppointment = appointment;
      },
      (error) => {
        this.dismissLoading(this.loading);
        console.log(error.error.message);
      }
    );
  }

  applyClosedFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    const filterValue = target.value.trim().toLowerCase();

    if (filterValue === '') {
      this.filteredClosedAppointment = this.originalClosedAppointment; // Restore the original list when filter is empty
    } else {
      this.filteredClosedAppointment = this.originalClosedAppointment.filter(
        (appointment) =>
          appointment.service.toLowerCase().includes(filterValue) ||
          appointment.doctor.toLowerCase().includes(filterValue) // Adjust the property to filter by
      );
    }
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

  viewMore() {
    this.openAppDetailsModal(this.filteredOpenAppointment[0]);
  }

  async openAppDetailsModal(data: MyAppointmentDetails) {
    const modal = await this.modalController.create({
      component: AppointmentDetailsPage,
      componentProps: {
        data: data,
      },
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        // console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }

  async showAppointmentNotification() {
    await LocalNotifications['schedule']({
      notifications: [
        {
          title: 'New Appointment',
          body: 'You have a new appointment booked.',
          sound: '../../../../../assets/notification/alert-notify.wav', // Replace with your sound file name
          id: 1,
        },
      ],
    });
  }

  ngOnDestroy(): void {
    if (this.dataOpenSubcription || this.dataClosedSubcription) {
      this.dataOpenSubcription.unsubscribe();
      this.dataClosedSubcription.unsubscribe();
    }
  }
}
