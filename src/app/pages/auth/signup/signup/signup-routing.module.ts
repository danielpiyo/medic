import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPage,
  },
  {
    path: 'onboard-academic',
    loadChildren: () =>
      import('../../../onboard/academic/academic/academic.module').then(
        (m) => m.AcademicPageModule
      ),
  },
  {
    path: 'onboard-basic',
    loadChildren: () =>
      import('../../../onboard/basic/basic/basic.module').then(
        (m) => m.BasicPageModule
      ),
  },
  {
    path: 'onboard-experience',
    loadChildren: () =>
      import('../../../onboard/experience/experience/experience.module').then(
        (m) => m.ExperiencePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPageRoutingModule {}
