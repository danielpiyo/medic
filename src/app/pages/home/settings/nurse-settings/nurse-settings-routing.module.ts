import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NurseSettingsPage } from './nurse-settings.page';

const routes: Routes = [
  {
    path: '',
    component: NurseSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseSettingsPageRoutingModule {}
