import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedicalSuggestionPage } from './medical-suggestion.page';

const routes: Routes = [
  {
    path: '',
    component: MedicalSuggestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalSuggestionPageRoutingModule {}
