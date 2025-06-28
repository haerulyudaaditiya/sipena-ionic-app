import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { ModalController, Platform } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})
export class WelcomePage implements OnInit {
  isChecked = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private androidPermissions: AndroidPermissions,
    private platform: Platform
  ) {}

  ngOnInit() {}

  async agreeAndContinue() {
    if (!this.isChecked) {
      this.showCustomAlert(
        'warning',
        'Peringatan',
        'Anda harus menyetujui syarat dan ketentuan untuk melanjutkan.'
      );
      return;
    }

    try {
      // Cek jika berjalan di perangkat Android
      if (this.platform.is('android') && !this.platform.is('mobileweb')) {
        const result = await this.androidPermissions.requestPermissions([
          this.androidPermissions.PERMISSION.CAMERA,
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
          this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        ]);

        if (!result.hasPermission) {
          throw new Error('Izin ditolak oleh pengguna.');
        }
      }

      // Simpan status persetujuan
      localStorage.setItem('isAgreed', 'true');

      // Arahkan ke halaman login
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      this.showCustomAlert(
        'danger',
        'Izin Ditolak',
        'Aplikasi memerlukan semua izin yang diminta untuk dapat berfungsi dengan baik.'
      );
    }
  }

  /**
   * DITAMBAHKAN: Fungsi helper baru untuk menampilkan alert kustom
   */
  async showCustomAlert(
    type: 'success' | 'danger' | 'warning' | 'primary',
    header: string,
    message: string,
    okHandler?: () => void
  ) {
    const iconMap = {
      success: 'checkmark-circle-outline',
      danger: 'alert-circle-outline',
      warning: 'warning-outline',
      primary: 'information-circle-outline',
    };

    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: iconMap[type],
        alertType: type,
        headerText: header,
        messageText: message,
        confirmButton: { text: 'OK' },
      },
      cssClass: 'custom-alert-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm' && okHandler) {
      okHandler();
    }
  }
}
