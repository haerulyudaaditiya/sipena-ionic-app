import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule penting untuk [(ngModel)]
import { IonicModule } from '@ionic/angular';

import { FormCutiPageRoutingModule } from './form-cuti-routing.module';
import { FormCutiPage } from './form-cuti.page';

// DITAMBAHKAN: Import komponen alert kustom (karena standalone)
import { CustomAlertComponentModule } from '../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Pastikan ini diimpor
    IonicModule,
    FormCutiPageRoutingModule,
    CustomAlertComponentModule // <-- Tambahkan di sini
  ],
  declarations: [FormCutiPage]
})
export class FormCutiPageModule {}
