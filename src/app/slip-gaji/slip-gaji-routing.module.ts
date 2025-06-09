import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SlipGajiPage } from './slip-gaji.page';

const routes: Routes = [
  {
    path: '',
    component: SlipGajiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlipGajiPageRoutingModule {}
