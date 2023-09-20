import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
import {
  MyAppointmentDetails,
  UserToken,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-new-payments',
  templateUrl: './new-payments.page.html',
  styleUrls: ['./new-payments.page.scss'],
})
export class NewPaymentsPage implements OnInit {
  closedAppointmentLists!: Observable<MyAppointmentDetails[]>;
  originalClosedAppointment: MyAppointmentDetails[] = [];
  filteredClosedAppointment: MyAppointmentDetails[] = [];
  dataClosedSubcription!: Subscription;
  userToken!: UserToken;
  modelData: any;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.getClosedAppointments();
  }

  async ngOnInit() {
    const loading = await this.showLoading();
    setTimeout(() => {
      this.getClosedAppointments();
      this.dismissLoading(loading);
    }, 4000);
  }

  async getClosedAppointments() {
    const loading = await this.showLoading();
    this.closedAppointmentLists =
      this._appointmentService.getClosedAppointments(this.userToken);
    this.dataClosedSubcription = this.closedAppointmentLists.subscribe(
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

  ngOnDestroy(): void {
    if (this.dataClosedSubcription) {
      this.dataClosedSubcription.unsubscribe();
    }
  }
}
