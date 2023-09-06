import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPage } from './config.page';

const routes: Routes = [
  {
    path: 'home',
    component: ConfigPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../pages/home/dashboard/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: 'appintments',
        loadChildren: () =>
          import(
            '../pages/home/appointments/appointments/appointments.module'
          ).then((m) => m.AppointmentsPageModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import(
            '../pages/home/payments/new-payments/new-payments.module'
          ).then((m) => m.NewPaymentsPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../pages/home/profile/profile/profile.module').then(
            (m) => m.ProfilePageModule
          ),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('../pages/auth/login/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('../pages/auth/signup/signup/signup.module').then(
        (m) => m.SignupPageModule
      ),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ConfigPageRoutingModule {}
