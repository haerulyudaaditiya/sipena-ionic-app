import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiwayatPageRoutingModule } from './riwayat-routing.module';

import { RiwayatPage } from './riwayat.page';
import { CustomAlertComponentModule } from '../components/custom-alert/custom-alert.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatPageRoutingModule,
    CustomAlertComponentModule
  ],
  declarations: [RiwayatPage]
})
export class RiwayatPageModule {}
