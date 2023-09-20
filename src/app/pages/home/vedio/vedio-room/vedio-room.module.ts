import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VedioRoomPageRoutingModule } from './vedio-room-routing.module';

import { VedioRoomPage } from './vedio-room.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VedioRoomPageRoutingModule
  ],
  declarations: [VedioRoomPage]
})
export class VedioRoomPageModule {}
