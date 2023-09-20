import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentDetailsPage } from './appointment-details.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentDetailsPage,
  },
  {
    path: 'map',
    loadChildren: () =>
      import('../map/map/map.module').then((m) => m.MapPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentDetailsPageRoutingModule {}
