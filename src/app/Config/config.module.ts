import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfigPageRoutingModule } from './config-routing.module';

import { ConfigPage } from './config.page';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ConfigPageRoutingModule],
  declarations: [ConfigPage],
})
export class ConfigPageModule {}
