import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, Subscription, take, timeout } from 'rxjs';
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
  pasPaymentLists!: Observable<MyAppointmentDetails[]>;
  originalPastPayment: MyAppointmentDetails[] = [];
  filteredPastPayment: MyAppointmentDetails[] = [];
  dataPastPaymentSubcription!: Subscription;
  userToken!: UserToken;
  modelData: any;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
    this.pastPayments();
  }

  async ngOnInit() {
    const loading = await this.showLoading();
    setTimeout(() => {
      this.pastPayments();
      this.dismissLoading(loading);
    }, 4000);
  }

  async pastPayments() {
    const loading = await this.showLoading();
    this.pasPaymentLists = this._appointmentService.getClosedAppointments(
      this.userToken
    );
    this.dataPastPaymentSubcription = this.pasPaymentLists
      .pipe(
        take(1),
        timeout(10000) // Set a timeout of 10 seconds (adjust as needed)
      )
      .subscribe(
        (appointment: any) => {
          this.dismissLoading(loading);
          this.originalPastPayment = appointment; // Initialize the original list
          this.filteredPastPayment = appointment; // Initialize the filtered list
        },
        (error) => {
          this.dismissLoading(loading);
          console.log(error.error.message);
        }
      );
    // this.dataOpenSubcription = this.openAppointmentLists.subscribe
  }

  applyClosedFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    const filterValue = target.value.trim().toLowerCase();

    if (filterValue === '') {
      this.filteredPastPayment = this.originalPastPayment; // Restore the original list when filter is empty
    } else {
      this.filteredPastPayment = this.originalPastPayment.filter(
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
    if (this.dataPastPaymentSubcription) {
      this.dataPastPaymentSubcription.unsubscribe();
    }
  }
}
