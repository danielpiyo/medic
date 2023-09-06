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
    loadChildren: () => import('./pages/auth/signup/verification/verification.module').then( m => m.VerificationPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
