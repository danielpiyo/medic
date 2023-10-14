import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nurse-settings',
  templateUrl: './nurse-settings.page.html',
  styleUrls: ['./nurse-settings.page.scss'],
})
export class NurseSettingsPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {}
  openPrivacyPolicy() {}

  async closeModal() {
    const openModal = await this.modalController.getTop(); // Get the top-most open modal

    if (openModal) {
      this.modalController.dismiss();
    } else {
      this.router.navigate(['/signup']);
      // Do something else when there is no open modal
      console.log('No open modal found. Doing something else...');
    }
  }
}
