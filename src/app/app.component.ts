import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import {
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { CustomAlertComponent } from './components/custom-alert/custom-alert.component'; // 2. Import CustomAlert
import { NetworkService } from './services/network.service'; // 1. Import NetworkService
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private lastBackTime = 0;
  public isOnline$: Observable<boolean>; // Properti untuk status online

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private toastController: ToastController,
    private router: Router,
    private location: Location,
    private networkService: NetworkService, // DITAMBAHKAN: Inject NetworkService
    private navCtrl: NavController,
    private pushNotificationService: PushNotificationService
  ) {
    this.isOnline$ = this.networkService.getOnlineStatus(); // Ambil status online
    this.initializeApp();
    this.handleBackButton();
  }

  async initializeApp() {
    await this.platform.ready();

    // Jalankan pemantau jaringan
    this.networkService.initializeNetworkEvents();
    this.pushNotificationService.initPush();

    if (Capacitor.getPlatform() !== 'web') {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: 'light' });
      } catch (error) {
        console.warn('StatusBar error:', error);
      }
    }

    // Logika routing awal Anda tetap sama
    const isAgreed = localStorage.getItem('isAgreed');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUrl = window.location.pathname;

    if (!isAgreed || isAgreed !== 'true') {
      await this.router.navigateByUrl('/welcome', { replaceUrl: true });
    } else if (isLoggedIn === 'true') {
      await this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } else {
      if (
        currentUrl !== '/forgot-password' &&
        currentUrl !== '/reset-password'
      ) {
        await this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    }
  }

  // DITAMBAHKAN: Fungsi untuk tombol "Coba Lagi" di halaman offline
  checkNetwork() {
    window.location.reload(); // Cara paling sederhana dan efektif
  }

  handleBackButton() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url;
      const exitPages = ['/dashboard', '/login'];

      if (exitPages.includes(currentUrl)) {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastBackTime < 2000) {
          // DIUBAH: Menggunakan modal kustom untuk konfirmasi keluar
          this.showExitConfirm();
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

  /**
   * DITAMBAHKAN: Fungsi baru untuk menampilkan alert kustom saat keluar
   */
  async showExitConfirm() {
    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: 'exit-outline',
        alertType: 'danger',
        headerText: 'Keluar Aplikasi',
        messageText: 'Apakah Anda yakin ingin keluar dari aplikasi?',
        cancelButton: { text: 'Batal' },
        confirmButton: { text: 'Ya, Keluar' },
      },
      cssClass: 'custom-alert-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm') {
      CapacitorApp.exitApp();
    }
  }
}
