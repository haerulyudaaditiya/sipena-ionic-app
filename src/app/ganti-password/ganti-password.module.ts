import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GantiPasswordPage } from './ganti-password.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule, // ✅ Tambahkan ini
    RouterModule.forChild([{ path: '', component: GantiPasswordPage }])
  ],
  declarations: [GantiPasswordPage]
})
export class GantiPasswordPageModule {}
