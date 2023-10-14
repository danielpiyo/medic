import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '@capacitor/camera';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SignupService } from 'src/app/shared-resources/auth/signup/signup.service';
import { LincesesService } from 'src/app/shared-resources/linceses/linceses.service';
import {
  PictureService,
  UserPhoto,
} from 'src/app/shared-resources/picture/picture.service';
import { AcademicOnboardPayload } from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-academic',
  templateUrl: './academic.page.html',
  styleUrls: ['./academic.page.scss'],
})
export class AcademicPage implements OnInit, OnDestroy {
  academicFormGroup!: FormGroup;
  base64TypeImage: any;
  dataSubscription!: Subscription;
  UserEmail!: string;

  constructor(
    private formBuilder: FormBuilder,
    public photoService: PictureService,
    public lincessService: LincesesService,
    public actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private onboardService: SignupService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params && params['email']) {
        this.UserEmail = params['email'];
      }
    });
  }

  async ngOnInit() {
    this.initForm();
    await this.photoService.loadSaved();
    await this.lincessService.loadSaved();
  }

  async addAcademicData() {
    if (this.academicFormGroup.valid) {
      const academicDetails: AcademicOnboardPayload = {
        email: this.UserEmail,
        academic_org_issue:
          this.academicFormGroup.get('academic_org_issue')!.value,
        academic_year_award: this.academicFormGroup.get('academic_year_award')!
          .value,
        lincesing_org: this.academicFormGroup.get('lincesing_org')!.value,
        level: this.academicFormGroup.get('level')!.value,
        linces_no: this.academicFormGroup.get('linces_no')!.value,
        lincesing_year_award: this.academicFormGroup.get(
          'lincesing_year_award'
        )!.value,
      };
      console.log('Details', academicDetails);

      try {
        const loading = await this.showLoading(); // Display loading spinner

        this.dataSubscription = this.onboardService
          .academicOnBoard(academicDetails)
          .subscribe(
            (response: any) => {
              // Data fetching is already handled by subscription
              this.dismissLoading(loading); // Dismiss the loading spinner
              this.presentSuccessAlert();

              this.router.navigate(['/signup/onboard-experience'], {
                queryParams: {
                  email: this.UserEmail,
                },
              });
            },
            (error: any) => {
              this.dismissLoading(loading); // Dismiss the loading spinner on error
              this.presentErrorAlert(error.error);
            }
          );
      } catch (error) {
        console.error('Error while displaying/loading spinner:', error);
      }
    }
  }

  initForm() {
    this.academicFormGroup = this.formBuilder.group({
      level: ['', Validators.required],
      academic_org_issue: ['', Validators.required],
      academic_year_award: ['', Validators.required],
      lincesing_org: ['', Validators.required],
      linces_no: ['', Validators.required],
      lincesing_year_award: ['', Validators.required],
    });
  }

  addAcademicToGallary() {
    this.photoService.addNewToGallery();
  }

  addLincesesToGallary() {
    this.lincessService.addNewToGallery();
  }
  uploadLincesesNow(webviewPath: string) {
    // Find the UserPhoto object that matches the webviewPath
    const selectedPhoto: UserPhoto | undefined =
      this.lincessService.lincesPhotos.find(
        (linsesPhoto) => linsesPhoto.webviewPath === webviewPath
      );

    if (selectedPhoto) {
      // Call the sendSavedPhotoToAPI method from the PictureService
      this.lincessService
        .sendSavedPhotoToAPI(selectedPhoto)
        .then(() => {
          // Handle success, e.g., display a success message
          console.log('Upload success');
        })
        .catch((error) => {
          // Handle error, e.g., display an error message
          console.error('Upload error:', error);
        });
    }
  }

  public async showLincesActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.lincessService.deletePicture(photo, position);
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
  // show Loading
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Submiting Data...',
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
      message: 'Data update succesfully!',
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

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
