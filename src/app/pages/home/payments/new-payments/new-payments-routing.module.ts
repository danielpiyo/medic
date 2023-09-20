import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPaymentsPage } from './new-payments.page';

const routes: Routes = [
  {
    path: '',
    component: NewPaymentsPage,
  },
  {
    path: 'payment-details',
    loadChildren: () =>
      import('../paymentDetails/payment-details/payment-details.module').then(
        (m) => m.PaymentDetailsPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPaymentsPageRoutingModule {}
