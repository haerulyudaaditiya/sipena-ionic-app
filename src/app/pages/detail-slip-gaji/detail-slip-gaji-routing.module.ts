import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailSlipGajiPage } from './detail-slip-gaji.page';

const routes: Routes = [
  {
    path: '',
    component: DetailSlipGajiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailSlipGajiPageRoutingModule {}
