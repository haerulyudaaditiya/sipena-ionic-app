import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfilePopoverComponent } from './profile-popover/profile-popover/profile-popover.component';

import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx'; // Import FileOpener
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, ProfilePopoverComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FileOpener,  
    AndroidPermissions
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
