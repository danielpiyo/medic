import { Component, OnInit } from '@angular/core';
// import { Network } from '@capacitor/network';
// import { Toast } from '@capacitor/toast';
import { Plugins } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private toastController: ToastController) {}

  async ngOnInit() {
    this.checkNetworkStatus();

    // Add an event listener to detect changes in online/offline status
    window.addEventListener('online', () => {
      this.presentToast('You are back online!');
    });

    window.addEventListener('offline', () => {
      this.presentToast('You are offline. Please check your network.');
    });
    await LocalNotifications['requestPermissions']();
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
