import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppointmentDetailsPageRoutingModule } from './appointment-details-routing.module';

import { AppointmentDetailsPage } from './appointment-details.page';
import { MedicalSuggestionPageModule } from '../suggestion/medical-suggestion/medical-suggestion.module';
import { MapPageModule } from '../map/map/map.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppointmentDetailsPageRoutingModule,
    MedicalSuggestionPageModule,
  ],
  declarations: [AppointmentDetailsPage],
  exports: [AppointmentDetailsPage],
})
export class AppointmentDetailsPageModule {}
