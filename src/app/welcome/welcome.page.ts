import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {
  isChecked = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private androidPermissions: AndroidPermissions,
    private platform: Platform
  ) {}
 
  ngOnInit() { }

  async agreeAndContinue() {
    if (!this.isChecked) {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Silakan centang untuk menyetujui syarat dan ketentuan!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      // Cek jika berjalan di perangkat Android (bukan di browser)
      if (this.platform.is('android') && !this.platform.is('mobileweb')) {
        await this.androidPermissions.requestPermissions([
          this.androidPermissions.PERMISSION.CAMERA,
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
          this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        ]);
      }

      // Simpan status persetujuan ke localStorage
      localStorage.setItem('isAgreed', 'true');

      // Arahkan ke halaman login
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Izin Ditolak',
        message: 'Aplikasi memerlukan semua izin tersebut untuk digunakan.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}

