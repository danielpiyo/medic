import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import {
  Observable,
  Subject,
  Subscription,
  take,
  takeUntil,
  timeout,
} from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';
import {
  MyAppointmentDetails,
  MyPastWithdrawal,
  UserToken,
  withdrawaPayload,
} from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-new-payments',
  templateUrl: './new-payments.page.html',
  styleUrls: ['./new-payments.page.scss'],
})
export class NewPaymentsPage implements OnInit, OnDestroy {
  pasPaymentLists!: Observable<MyAppointmentDetails[]>;
  originalPastPayment: MyAppointmentDetails[] = [];
  myPastWithdrawals: MyPastWithdrawal[] = [];
  filteredPastPayment: MyAppointmentDetails[] = [];
  dataPastPaymentSubcription!: Subscription;
  userToken!: UserToken;
  modelData: any;
  loading: any;
  balance!: number;
  withdrawalAmount: number = 0; // The withdrawal amount entered by the user
  currentBalance: number = 0;
  phoneNumber: string = '';
  myWithdrawMode: boolean = false;
  error: boolean = false; // Variable to track whether there's an error
  showDetailsSection: boolean = false;
  hideTherest: boolean = false;
  showWithdrawSection: boolean = false;
  dataAvailable: boolean = false;
  intervalId: any;
  dataOpenSubcription!: Subscription; //
  withdrawlSubscription!: Subscription;
  currentErrorAlert: HTMLIonAlertElement | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _appointmentService: AppointmentsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.userToken = {
      token: JSON.parse(localStorage.getItem('currentToken') || '{}') as string,
    };
  }

  async ngOnInit() {
    this.loading = await this.showLoading();
    this.pastPayments();
    this.myWithdrawals();
    this.getNurseBalance();

    // Periodically fetch data and store the interval ID
    this.intervalId = setInterval(() => {
      this.pastPayments();
      this.getNurseBalance();
      this.myWithdrawals();
    }, 10000);
  }

  getNurseBalance() {
    this._appointmentService
      .getNurseBalance(this.userToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: any) => {
          this.balance = res.balance;
          this.currentBalance = this.balance;
          this.dataAvailable = true;
          console.log('Balancet', this.balance);
        },
        (error) => {
          this.dataAvailable = false;
          this.presentErrorAlert(error.error);
          if (
            error.error.message ===
            'Your authentication token has Expired. Login again'
          ) {
            this.router.navigate(['/login']);
          }
        }
      );
  }

  enableDetailsButton() {
    // Enable the "Details" button when the user enters an amount within the balance
    this.showDetailsSection = false; // Hide the details section
    this.error = false; // Reset the error flag
  }

  calculateArrivalDate(): string {
    // Calculate the estimated arrival date (4 days from the request date)
    const requestDate = new Date();
    requestDate.setDate(requestDate.getDate() + 4); // Add 4 days to the request date
    return requestDate.toLocaleDateString();
  }

  calculateTransactionFee(): number {
    // Define the transaction fee tiers
    const tier1Threshold = 2200;
    const tier2Threshold = 1500;

    // Calculate the transaction fee based on the withdrawal amount
    if (this.withdrawalAmount > tier1Threshold) {
      return 80; // Transaction fee is $100 for amounts exceeding 800
    } else if (this.withdrawalAmount >= tier2Threshold) {
      return 60; // Transaction fee is $50 for amounts between 400 and 800 (inclusive)
    } else {
      return 30; // Transaction fee is $20 for amounts below 400
    }
  }

  calculateAmountToReceive(): number {
    // Calculate the amount to receive (withdrawal amount minus transaction fee)
    const transactionFee = this.calculateTransactionFee();
    const amountToReceive = this.withdrawalAmount - transactionFee;
    return amountToReceive;
  }

  showDetails() {
    // Check if the withdrawal amount exceeds the current balance
    if (this.withdrawalAmount > this.currentBalance) {
      // Display an error message and prevent showing details
      this.error = true;
      this.showDetailsSection = false;
      this.showWithdrawSection = false;
      this.hideTherest = false;
    } else {
      // Show the details section when the "Details" button is clicked
      this.showDetailsSection = true;
      this.hideTherest = true;
      this.showWithdrawSection = false;
    }
  }

  toggleWithdrawSection() {
    this.showWithdrawSection = !this.showWithdrawSection;
    this.showDetailsSection = false;
    this.hideTherest = true;
  }

  closeDetails() {
    this.showDetailsSection = false;
    this.hideTherest = false;
  }
  closeWithdrawal() {
    this.showWithdrawSection = false;
    this.hideTherest = false;
  }

  withdrawMode() {
    this.myWithdrawMode = true;
  }

  closeWithdrawMode() {
    this.showDetailsSection = false;
    this.showWithdrawSection = false;
    this.hideTherest = false;
    this.myWithdrawMode = false;
  }

  async withdrawNow() {
    this.loading = await this.showLoading();
    const withdrawPayload: withdrawaPayload = {
      token: this.userToken.token,
      withdrawalStatus: 'Initiated ..',
      withdrawalAmount: this.withdrawalAmount,
      phoneNumber: this.phoneNumber,
      balance: this.currentBalance - this.withdrawalAmount,
      amountToRecieve: this.calculateAmountToReceive(),
      transactionCost: this.calculateTransactionFee(),
      passibleArrivalTime: this.calculateArrivalDate(),
    };
    console.log(withdrawPayload);
    this._appointmentService
      .requestWithrawal(withdrawPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.closeWithdrawMode();
          this.dismissLoading(this.loading);
          this.presentSuccessAlert(withdrawPayload);
          this.withdrawalAmount = 0;
          this.phoneNumber = '';
          this.withdrawalAmount = 0;
        },
        (error) => {
          this.dismissLoading(this.loading);
          this.presentErrorAlert(error.error);
          console.log(error);
          if (
            error.error.message ===
            'Your authentication token has Expired. Login again'
          ) {
            this.router.navigate(['/login']);
          }
        }
      );
  }

  async pastPayments() {
    this.pasPaymentLists = this._appointmentService.getClosedAppointments(
      this.userToken
    );
    this.pasPaymentLists.pipe(takeUntil(this.destroy$)).subscribe(
      (appointment: any) => {
        this.dismissLoading(this.loading);
        this.originalPastPayment = appointment; // Initialize the original list
        this.filteredPastPayment = appointment; // Initialize the filtered list
      },
      (error) => {
        this.dismissLoading(this.loading);
        console.log(error.error.message);
        if (
          error.error.message ===
          'Your authentication token has Expired. Login again'
        ) {
          this.router.navigate(['/login']);
        }
      }
    );
    // this.dataOpenSubcription = this.openAppointmentLists.subscribe
  }

  async myWithdrawals() {
    this._appointmentService
      .getMyWithrawal(this.userToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (withdrwals: any) => {
          this.dismissLoading(this.loading);
          this.myPastWithdrawals = withdrwals;
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

  async presentSuccessAlert(data: withdrawaPayload) {
    const alert = await this.alertController.create({
      header: 'Success',
      message: `Your Withdrawal Request has beed Submited succesfully!. ${data.amountToRecieve} shall be debited into Your phone: ${data.phoneNumber} betwwen now and ${data.passibleArrivalTime}.`,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorAlert(error: Error) {
    // Check if there is already an error alert open, and dismiss it if it exists
    if (this.currentErrorAlert) {
      this.currentErrorAlert.dismiss();
    }

    const errorMessage = error.message ? error.message : 'Server Error';

    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK'],
    });

    await alert.present();

    // Set the currently displayed error alert
    this.currentErrorAlert = alert;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
