import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { MedicalSuggestionPage } from '../suggestion/medical-suggestion/medical-suggestion.page';
import {
  InitiateAppointmentPayload,
  MyAppointmentDetails,
  Prescription,
  SuggestionMessage,
  closeAppointmentPayload,
} from 'src/app/shared-resources/types/type.model';
import { Router } from '@angular/router';
import { PrescriptionimageService } from 'src/app/shared-resources/prescription/prescriptionimage.service';
import { Subscription } from 'rxjs';
import { AppointmentsService } from 'src/app/shared-resources/home/appointments/appointments.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.page.html',
  styleUrls: ['./appointment-details.page.scss'],
})
export class AppointmentDetailsPage implements OnInit, OnDestroy {
  @Input() data!: MyAppointmentDetails;
  modelData: any;
  prescriptionPhotos: any;
  suggestion: boolean = false;
  showmap: boolean = false;
  currentToken!: string;
  dataSubscription!: Subscription;
  startPreSubscription!: Subscription;
  prescribe: boolean = false;

  // prescription
  suggestionValues: string[] = [];
  doctor_description: string = '';
  options = [
    { label: 'Evacuation', selected: false },
    { label: 'Home Visit', selected: false },
    { label: 'Concierge', selected: false },
    // Add more options as needed
  ];

  selectAll = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private prescritioService: PrescriptionimageService,
    private appointmentService: AppointmentsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.currentToken = JSON.parse(
      localStorage.getItem('currentToken') || '{}'
    );
  }

  ngOnInit() {
    setTimeout(() => {}, 4000);
  }

  async closeModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal
    if (openModal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/home/dashboard']);
      // Do something else when there is no open modal
      console.log('No open modal found. Doing something else...');
    }
  }

  async startPrescribe() {
    const loading = await this.showLoading();
    const payload: InitiateAppointmentPayload = {
      token: this.currentToken,
      id: this.data.id,
      appointment_status: 'Service started',
    };
    this.startPreSubscription = this.appointmentService
      .initiateAttendance(payload)
      .subscribe(
        (res) => {
          console.log(res);
          this.presentSucPresAlert();
          this.dismissLoading(loading);
          this.prescribe = true;
        },
        (error: any) => {
          this.dismissLoading(loading);
          this.presentErrorAlert(error.error);
          console.log(error);
        }
      );
  }

  async closeAppointment() {
    // const loading = await this.showLoading();
    const payload: closeAppointmentPayload = {
      token: this.currentToken,
      id: this.data.id,
    };
    this.startPreSubscription = this.appointmentService
      .closeAppointment(payload)
      .subscribe(
        (res) => {
          // this.dismissLoading(loading);
          console.log(res);
        },
        (error: any) => {
          // this.dismissLoading(loading);
          this.presentErrorAlert(error.error);
          console.log(error);
        }
      );
  }

  showMap() {
    this.closeModal();
    this.router.navigate(['/home/appointments/appointment-details/map']);
  }

  selectAllChanged() {
    for (const option of this.options) {
      option.selected = this.selectAll;
    }
  }

  async updatePatient() {
    const loading = await this.showLoading();
    const suggestionValues = this.options
      .filter((option) => option.selected)
      .map((option) => option.label);
    const prescriptioPayload: Prescription = {
      token: this.currentToken,
      appointment_id: this.data.id,
      patient_id: this.data.user_id,
      doctor: this.data.doctor,
      patient: this.data.patient,
      service_id: this.data.service_id,
      service: this.data.service,

      doctor_notes: this.doctor_description,
      patient_description: this.data.description,
      suggestion: suggestionValues,
    };
    console.log('data', prescriptioPayload);

    this.dataSubscription = this.prescritioService
      .postPrescription(prescriptioPayload)
      .subscribe(
        (res) => {
          this.closeAppointment();
          this.dismissLoading(loading);
          this.presentSuccessAlert();
          this.closeModal();
        },
        (error) => {
          this.dismissLoading(loading);
          console.log(error.error.message);
          this.presentErrorAlert(error.error);
        }
      );
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

  // Alert
  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Prescription updated succesfully!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentSucPresAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Attendance Started!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentErrorAlert(error: Error) {
    const errorMessage = error.message ? error.message : 'Server Error'; // Check if error.message is defined, otherwise use "Server Error"

    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK'],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription || this.startPreSubscription) {
      this.dataSubscription.unsubscribe();
      this.startPreSubscription.unsubscribe();
    }
  }
}
