import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PresensiPageRoutingModule } from './presensi-routing.module';

import { PresensiPage } from './presensi.page';
import { CustomAlertComponentModule } from '../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PresensiPageRoutingModule,
    CustomAlertComponentModule
  ],
  declarations: [PresensiPage]
})
export class PresensiPageModule {}
