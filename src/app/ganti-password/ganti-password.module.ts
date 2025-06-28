import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GantiPasswordPage } from './ganti-password.page';
import { RouterModule } from '@angular/router';
import { CustomAlertComponentModule } from '../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, // ✅ Tambahkan ini
    RouterModule.forChild([{ path: '', component: GantiPasswordPage }]),
    CustomAlertComponentModule
  ],
  declarations: [GantiPasswordPage]
})
export class GantiPasswordPageModule {}
