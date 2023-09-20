import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { NewPaymentsPageModule } from '../../payments/new-payments/new-payments.module';
import { AppointmentsPageModule } from '../../appointments/appointments/appointments.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    NewPaymentsPageModule,
    AppointmentsPageModule,
  ],
  declarations: [DashboardPage],
})
export class DashboardPageModule {}
