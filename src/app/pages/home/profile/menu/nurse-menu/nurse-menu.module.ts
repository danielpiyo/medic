import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NurseMenuPageRoutingModule } from './nurse-menu-routing.module';

import { NurseMenuPage } from './nurse-menu.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NurseMenuPageRoutingModule],
  declarations: [NurseMenuPage],
  exports: [NurseMenuPage],
})
export class NurseMenuPageModule {}
