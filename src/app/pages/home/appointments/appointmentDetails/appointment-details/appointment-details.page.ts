import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { MedicalSuggestionPage } from '../suggestion/medical-suggestion/medical-suggestion.page';
import {
  MyAppointmentDetails,
  SuggestionMessage,
} from 'src/app/shared-resources/types/type.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.page.html',
  styleUrls: ['./appointment-details.page.scss'],
})
export class AppointmentDetailsPage implements OnInit {
  @Input() data!: MyAppointmentDetails;
  modelData: any;
  prescriptionPhotos: any;
  suggestion: boolean = false;
  showmap: boolean = false;
  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private router: Router
  ) {}

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

  uploadPrescriptionNow() {}

  public async showPrescriptionDetailsActionSheet() {
    // position: number // photo: UserPhoto,
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            // this.prescriptionImageService.deletePicture(photo, position);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
  /**Suggestion Modal */
  suggestAdditonal() {
    this.suggestion = true;
  }
  async openSuggestionModal(data: string) {
    const suggestionData: SuggestionMessage = {
      patient_id: 2,
      user_id: 5,
      message: data,
    };
    const modalInstance = await this.modalController.create({
      component: MedicalSuggestionPage,
      componentProps: {
        data: suggestionData,
      },
    });
    modalInstance.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modalInstance.present();
  }

  showMap() {
    this.closeModal();
    this.router.navigate(['/home/appointments/appointment-details/map']);
  }
}
