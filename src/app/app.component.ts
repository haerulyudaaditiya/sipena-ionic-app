import { Component } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private lastBackTime = 0;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router,
    private location: Location
  ) {
    this.initializeApp();
    this.handleBackButton();
  }

  async initializeApp() {
    await this.platform.ready();

    if (Capacitor.getPlatform() !== 'web') {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: 'transparent' });
      } catch (error) {
        console.warn('StatusBar error:', error);
      }
    }

    // Ambil data dari localStorage
    const isAgreed = localStorage.getItem('isAgreed');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUrl = window.location.pathname;

    console.log('>>> isAgreed:', isAgreed);
    console.log('>>> isLoggedIn:', isLoggedIn);

    if (!isAgreed || isAgreed !== 'true') {
      await this.router.navigateByUrl('/welcome', { replaceUrl: true });
    } else if (isLoggedIn === 'true') {
      await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      // Jangan redirect ke login jika user sedang di forgot-password atau reset-password
      if (
        currentUrl !== '/forgot-password' &&
        currentUrl !== '/reset-password'
      ) {
        await this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    }

  }

  handleBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url;
      const exitPages = ['/login', '/dashboard'];

      if (exitPages.includes(currentUrl)) {
        const currentTime = new Date().getTime();

        if (currentTime - this.lastBackTime < 2000) {
          const alert = await this.alertController.create({
            header: 'Keluar Aplikasi',
            message: 'Apakah Anda ingin keluar dari aplikasi?',
            buttons: [
              { text: 'Batal', role: 'cancel' },
              {
                text: 'Ya',
                handler: () => {
                  // Hapus status login
                  localStorage.removeItem('isLoggedIn');
                  CapacitorApp.exitApp();
                }
              }
            ]
          });
          await alert.present();
        } else {
          this.lastBackTime = currentTime;
          const toast = await this.toastController.create({
            message: 'Tekan sekali lagi untuk keluar aplikasi',
            duration: 1500,
            position: 'bottom',
          });
          await toast.present();
        }
      } else {
        this.location.back();
      }
    });
  }
}
