import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedicalSuggestionPageRoutingModule } from './medical-suggestion-routing.module';

import { MedicalSuggestionPage } from './medical-suggestion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicalSuggestionPageRoutingModule,
  ],
  declarations: [MedicalSuggestionPage],
  exports: [MedicalSuggestionPage],
})
export class MedicalSuggestionPageModule {}
