import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { LoginService } from '../auth/login/login.service';
import { Prescription } from '../types/type.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionimageService {
  public prescriptionPhotos: UserPhoto[] = [];
  private PRESCRIPTION_PHOTO_STORAGE: string = 'photos';
  private PRESCRIPTION_PHOTO_STORAGE_PREFIX = 'photos_';

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private authService: LoginService
  ) {}

  postPrescription(prescription: Prescription) {
    return this.http.post(
      `${environment.baseURL}/doctor/prescribe`,
      prescription
    );
  }

  public async loadSaved() {
    const user = this.authService.getCurrentUser(); // Get the current authenticated user
    if (!user) {
      return; // Handle unauthenticated users as needed
    }
    // Retrieve cached photo array data
    const photoList = await Preferences.get({
      key: this.PRESCRIPTION_PHOTO_STORAGE_PREFIX + user.id,
    });

    if (photoList && photoList.value !== null) {
      this.prescriptionPhotos = JSON.parse(photoList.value);
    } else {
      this.prescriptionPhotos = [];
    }

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.prescriptionPhotos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public async addNewToGallery() {
    const user = this.authService.getCurrentUser(); // Get the current authenticated user
    if (!user) {
      return; // Handle unauthenticated users as needed
    }

    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    console.log('SavedImageFile', savedImageFile);

    // Add the new photo to the user-specific gallery
    await this.addToUserGallery(user.id, savedImageFile);
    // await this.refresh();
    return capturedPhoto;
  }

  async refresh(): Promise<void> {
    window.location.reload();
  }
  // ...

  private async addToUserGallery(userId: number, photo: UserPhoto) {
    // Retrieve existing user-specific photo data
    const existingPhotos = await this.getUserPhotos(userId);
    // Add the new photo to the array
    existingPhotos.unshift(photo);
    // Cache the updated user-specific photo data
    await Preferences.set({
      key: this.PRESCRIPTION_PHOTO_STORAGE_PREFIX + userId,
      value: JSON.stringify(existingPhotos),
    });
  }

  private async getUserPhotos(userId: number): Promise<UserPhoto[]> {
    const photoList = await Preferences.get({
      key: this.PRESCRIPTION_PHOTO_STORAGE_PREFIX + userId,
    });
    if (photoList && photoList.value !== null) {
      return JSON.parse(photoList.value);
    }
    return [];
  }

  // Save picture to file on device
  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(photo: any) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: UserPhoto, position: number) {
    const user = this.authService.getCurrentUser(); // Get the current authenticated user
    if (!user) {
      return; // Handle unauthenticated users as needed
    }
    // Remove this photo from the Photos reference data array
    this.prescriptionPhotos.splice(position, 1);
    // Update photos array cache by overwriting the existing photo array
    Preferences.set({
      key: this.PRESCRIPTION_PHOTO_STORAGE_PREFIX + user.id,
      value: JSON.stringify(this.prescriptionPhotos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  // second saving to the server
  public async sendSavedPhotoToAPI(photo: UserPhoto) {
    try {
      // Read the saved photo from the file system
      const fileData = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Convert the file data to base64
      const base64Data = fileData.data;

      // Send the photo data to the endpoint
      await this.sendPhotoToEndpoint(base64Data);
      // Handle a successful upload
      console.log('Saved photo successfully uploaded');
    } catch (error) {
      // Handle errors
      console.error('Error uploading saved photo:', error);
    }
  }

  private async sendPhotoToEndpoint(photoData: any) {
    const endpointUrl = 'your_endpoint_url'; // Replace with your actual endpoint URL
    const requestData = { photoData }; // Modify the data structure as needed
    console.log(requestData);

    try {
      // Send the photo data to the endpoint via an HTTP POST request
      await this.http.post(endpointUrl, requestData).toPromise();
    } catch (error) {
      console.error('Error sending photo to the endpoint:', error);
      throw error;
    }
  }
}

export interface UserPhoto {
  filepath: any;
  webviewPath: any;
}
