import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DetailAbsensiPageRoutingModule } from './detail-absensi-routing.module';
import { DetailAbsensiPage } from './detail-absensi.page';

// DITAMBAHKAN: Import modul untuk image viewer
import { ImageViewerComponentModule } from '../../components/image-viewer/image-viewer.module';
import { CustomAlertComponentModule } from '../../components/custom-alert/custom-alert.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailAbsensiPageRoutingModule,
    ImageViewerComponentModule, // <-- Tambahkan modulnya di sini
    CustomAlertComponentModule
  ],
  declarations: [DetailAbsensiPage]
})
export class DetailAbsensiPageModule {}
