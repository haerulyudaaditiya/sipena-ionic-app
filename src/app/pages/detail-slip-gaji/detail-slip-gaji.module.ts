import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailSlipGajiPageRoutingModule } from './detail-slip-gaji-routing.module';

import { DetailSlipGajiPage } from './detail-slip-gaji.page';
import { CustomAlertComponentModule } from '../../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailSlipGajiPageRoutingModule,
    CustomAlertComponentModule
  ],
  declarations: [DetailSlipGajiPage]
})
export class DetailSlipGajiPageModule {}
