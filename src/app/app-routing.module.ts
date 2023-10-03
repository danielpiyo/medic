import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./Config/config.module').then((m) => m.ConfigPageModule),
  },
  {
    path: 'verification',
    loadChildren: () =>
      import('./pages/auth/signup/verification/verification.module').then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: 'medical-suggestion',
    loadChildren: () =>
      import(
        './pages/home/appointments/appointmentDetails/suggestion/medical-suggestion/medical-suggestion.module'
      ).then((m) => m.MedicalSuggestionPageModule),
  },
  {
    path: 'nurse-menu',
    loadChildren: () =>
      import('./pages/home/profile/menu/nurse-menu/nurse-menu.module').then(
        (m) => m.NurseMenuPageModule
      ),
  },
  {
    path: 'map',
    loadChildren: () =>
      import(
        './pages/home/appointments/appointmentDetails/map/map/map.module'
      ).then((m) => m.MapPageModule),
  },
  {
    path: 'vedio-room',
    loadChildren: () =>
      import('./pages/home/vedio/vedio-room/vedio-room.module').then(
        (m) => m.VedioRoomPageModule
      ),
  },
  {
    path: 'schedules',
    loadChildren: () =>
      import('./pages/home/schedule/schedules/schedules.module').then(
        (m) => m.SchedulesPageModule
      ),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import(
        './pages/auth/forgotpassword/forgot-password/forgot-password.module'
      ).then((m) => m.ForgotPasswordPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
