import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppointmentsPage } from './appointments.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsPage,
    children: [
      {
        path: 'appointment-details',
        loadChildren: () =>
          import(
            '../appointmentDetails/appointment-details/appointment-details.module'
          ).then((m) => m.AppointmentDetailsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsPageRoutingModule {}
