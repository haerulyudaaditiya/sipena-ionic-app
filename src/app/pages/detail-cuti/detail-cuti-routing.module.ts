import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailCutiPage } from './detail-cuti.page';

const routes: Routes = [
  {
    path: '',
    component: DetailCutiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailCutiPageRoutingModule {}
