import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GantiPasswordPage } from './ganti-password.page';

const routes: Routes = [
  {
    path: '',
    component: GantiPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GantiPasswordPageRoutingModule {}
