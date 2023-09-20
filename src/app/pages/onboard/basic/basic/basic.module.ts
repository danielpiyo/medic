import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasicPageRoutingModule } from './basic-routing.module';

import { BasicPage } from './basic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BasicPageRoutingModule,
  ],
  declarations: [BasicPage],
})
export class BasicPageModule {}
