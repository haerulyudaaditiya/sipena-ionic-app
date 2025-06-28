import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CustomAlertComponent } from './custom-alert.component';

@NgModule({
  declarations: [CustomAlertComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [CustomAlertComponent]
})
export class CustomAlertComponentModule {}
