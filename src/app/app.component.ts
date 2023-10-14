import { Component, OnInit } from '@angular/core';
// import { Network } from '@capacitor/network';
// import { Toast } from '@capacitor/toast';
import { Plugins } from '@capacitor/core';
import { Platform, ToastController } from '@ionic/angular';
import { LoginService } from './shared-resources/auth/login/login.service';
import { Router } from '@angular/router';
const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private toastController: ToastController,
    private platform: Platform,
    private authService: LoginService,
    private router: Router
  ) {
    // Subscribe to the resume event
    this.platform.resume.subscribe(() => {
      // Check if the user is authenticated based on the stored token
      if (this.authService.isAuthenticatedUser()) {
        // User is authenticated, navigate to the appropriate page
        this.router.navigate(['/home/dashboard']);
      } else {
        // User is not authenticated, show the login page
        this.router.navigate(['/login']);
      }
    });
  }

  async ngOnInit() {
    this.checkNetworkStatus();
    await LocalNotifications['requestPermissions']();
    // Add an event listener to detect changes in online/offline status
    window.addEventListener('online', () => {
      this.presentToast('You are back online!');
    });

    window.addEventListener('offline', () => {
      this.presentToast('You are offline. Please check your network.');
    });
  }

  checkNetworkStatus() {
    if (navigator.onLine) {
      this.presentToast('You are online');
    } else {
      this.presentToast('You are offline. Please check your network.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3500,
      position: 'bottom', // You can change the position as needed
    });

    await toast.present();
  }
}
