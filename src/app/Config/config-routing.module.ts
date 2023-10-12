import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPage } from './config.page';
import { AuthGuard } from '../directives/guard/auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: ConfigPage,
    children: [
      {
        path: 'dashboard',

        loadChildren: () =>
          import('../pages/home/dashboard/dashboard/dashboard.module').then(
            (m) => m.DashboardPageModule
          ),
      },
      {
        path: 'vedio',

        loadChildren: () =>
          import('../pages/home/vedio/vedio-room/vedio-room.module').then(
            (m) => m.VedioRoomPageModule
          ),
      },
      {
        path: 'appointments',

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
        redirectTo: '/dashboard',
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
    path: 'verify',
    loadChildren: () =>
      import('../pages/auth/signup/verification/verification.module').then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: 'forgot',
    loadChildren: () =>
      import(
        '../pages/auth/forgotpassword/forgot-password/forgot-password.module'
      ).then((m) => m.ForgotPasswordPageModule),
  },
  {
    path: 'terms-conditions',
    loadChildren: () =>
      import(
        '../pages/home/settings/nurse-settings/nurse-settings.module'
      ).then((m) => m.NurseSettingsPageModule),
  },
  {
    path: '',
    redirectTo: '/home/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ConfigPageRoutingModule {}
