import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfilePopoverComponent } from './profile-popover/profile-popover/profile-popover.component';

import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeId from '@angular/common/locales/id';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { CustomAlertComponentModule } from './components/custom-alert/custom-alert.module';
import { OfflineComponent } from './components/offline/offline.component'; // Import komponen offline

// Mendaftarkan data locale Bahasa Indonesia
registerLocaleData(localeId, 'id');

@NgModule({
  declarations: [AppComponent, ProfilePopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    OfflineComponent,
    CustomAlertComponentModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // DITAMBAHKAN KEMBALI: Set locale default aplikasi ke 'id'
    { provide: LOCALE_ID, useValue: 'id' },
    FileOpener,
    AndroidPermissions,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
