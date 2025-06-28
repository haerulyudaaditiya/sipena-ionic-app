import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailCutiPageRoutingModule } from './detail-cuti-routing.module';

import { DetailCutiPage } from './detail-cuti.page';
import { CustomAlertComponentModule } from '../../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailCutiPageRoutingModule,
    CustomAlertComponentModule
  ],
  declarations: [DetailCutiPage]
})
export class DetailCutiPageModule {}
