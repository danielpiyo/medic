import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NurseMenuPage } from './nurse-menu.page';

const routes: Routes = [
  {
    path: '',
    component: NurseMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NurseMenuPageRoutingModule {}
