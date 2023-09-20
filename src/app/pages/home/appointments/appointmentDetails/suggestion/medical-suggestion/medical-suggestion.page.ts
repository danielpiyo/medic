import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SuggestionMessage } from 'src/app/shared-resources/types/type.model';

@Component({
  selector: 'app-medical-suggestion',
  templateUrl: './medical-suggestion.page.html',
  styleUrls: ['./medical-suggestion.page.scss'],
})
export class MedicalSuggestionPage implements OnInit {
  @Input() data!: SuggestionMessage;
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.data);
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

  submit() {}
}
