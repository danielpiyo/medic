import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NurseSettingsPageRoutingModule } from './nurse-settings-routing.module';

import { NurseSettingsPage } from './nurse-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NurseSettingsPageRoutingModule
  ],
  declarations: [NurseSettingsPage]
})
export class NurseSettingsPageModule {}
