import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCutiPage } from './form-cuti.page';

const routes: Routes = [
  {
    path: '',
    component: FormCutiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCutiPageRoutingModule {}
