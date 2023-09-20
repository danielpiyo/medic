import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VedioRoomPage } from './vedio-room.page';

const routes: Routes = [
  {
    path: '',
    component: VedioRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VedioRoomPageRoutingModule {}
