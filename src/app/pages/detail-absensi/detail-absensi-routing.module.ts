import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailAbsensiPage } from './detail-absensi.page';

const routes: Routes = [
  {
    path: '',
    component: DetailAbsensiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailAbsensiPageRoutingModule {}
