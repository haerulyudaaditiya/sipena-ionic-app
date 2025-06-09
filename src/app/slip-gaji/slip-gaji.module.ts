import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlipGajiPageRoutingModule } from './slip-gaji-routing.module';

import { SlipGajiPage } from './slip-gaji.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SlipGajiPageRoutingModule
  ],
  declarations: [SlipGajiPage]
})
export class SlipGajiPageModule {}
