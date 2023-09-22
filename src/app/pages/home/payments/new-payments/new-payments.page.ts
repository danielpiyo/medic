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
  loading: any;
  balance!: number;

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
  }

  async ngOnInit() {
    this.loading = await this.showLoading();
    // Initial fetch of open and closed appointments
    this.pastPayments();
    this.getNurseBalance();
    // Periodically fetch open and closed appointments every 6 seconds
    setInterval(() => {
      this.pastPayments();
      this.getNurseBalance();
    }, 6000); // 6000 milliseconds = 6 seconds
  }

  getNurseBalance() {
    this._appointmentService
      .getNurseBalance(this.userToken)
      .subscribe((res: any) => {
        this.balance = res.balance;
        console.log('Balancet', this.balance);
      });
  }

  async pastPayments() {
    this.pasPaymentLists = this._appointmentService.getClosedAppointments(
      this.userToken
    );
    this.dataPastPaymentSubcription = this.pasPaymentLists.subscribe(
      (appointment: any) => {
        this.dismissLoading(this.loading);
        this.originalPastPayment = appointment; // Initialize the original list
        this.filteredPastPayment = appointment; // Initialize the filtered list
      },
      (error) => {
        this.dismissLoading(this.loading);
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
