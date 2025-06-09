import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormCutiPageRoutingModule } from './form-cuti-routing.module';

import { FormCutiPage } from './form-cuti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormCutiPageRoutingModule
  ],
  declarations: [FormCutiPage]
})
export class FormCutiPageModule {}
