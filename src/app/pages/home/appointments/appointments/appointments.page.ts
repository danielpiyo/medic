import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, Subscription, take, timeout } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
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
    this.getOpenApponments();
    this.getClosedAppointments();
    this.calculateTimeRemaining();
  }

  async ngOnInit() {
    const loading = await this.showLoading();
    setTimeout(() => {
      this.getClosedAppointments();
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
          // console.log('Open Appointment', this.filteredOpenAppointment);
          this.targetDate = new Date(this.filteredOpenAppointment[0]?.bookTime);
        },
        (error) => {
          this.dismissLoading(loading);
          console.log(error.error.message);
        }
      );
    // this.dataOpenSubcription = this.openAppointmentLists.subscribe
  }

  async getClosedAppointments() {
    const loading = await this.showLoading();
    this.closedAppointmentLists =
      this._appointmentService.getClosedAppointments(this.userToken);
    this.dataClosedSubcription = this.closedAppointmentLists
      .pipe(
        take(1),
        timeout(10000) // Set a timeout of 10 seconds (adjust as needed)
      )
      .subscribe(
        (appointment: any) => {
          this.dismissLoading(loading);
          this.originalClosedAppointment = appointment; // Initialize the original list
          this.filteredClosedAppointment = appointment; // Initialize the filtered list
        },
        (error) => {
          this.dismissLoading(loading);
          console.log(error.error.message);
        }
      );
    // this.dataOpenSubcription = this.openAppointmentLists.subscribe
  }

  // async getClosedAppointments() {
  //   const loading = await this.showLoading();
  //   this.closedAppointmentLists =
  //     this._appointmentService.getClosedAppointments(this.userToken);
  //   this.dataClosedSubcription = this.closedAppointmentLists.subscribe(
  //     (appointment: any) => {
  //       this.dismissLoading(loading);
  //       this.originalClosedAppointment = appointment; // Initialize the original list
  //       this.filteredClosedAppointment = appointment; // Initialize the filtered list
  //     },
  //     (error) => {
  //       this.dismissLoading(loading);
  //       console.log(error.error.message);
  //     }
  //   );
  // }

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

  ngOnDestroy(): void {
    if (this.dataOpenSubcription) {
      this.dataOpenSubcription.unsubscribe();
    } else if (this.dataClosedSubcription) {
      this.dataClosedSubcription.unsubscribe();
    }
  }
}
