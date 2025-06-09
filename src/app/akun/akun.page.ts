import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-akun',
  templateUrl: './akun.page.html',
  styleUrls: ['./akun.page.scss'],
  standalone: false,
})
export class AkunPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router : Router
  ) {}

  ngOnInit() {}

  // === Akun ===
  goToProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  changePassword() {
    this.navCtrl.navigateForward('/ganti-password');
  }

  changeLanguage() {
    this.navCtrl.navigateForward('/language-settings');
  }

  // === Keamanan ===
  enableTwoFactor() {
    this.navCtrl.navigateForward('/two-factor-auth');
  }

  viewLoginHistory() {
    this.navCtrl.navigateForward('/riwayat');
  }

  // === Bantuan ===
  openGuide() {
    this.navCtrl.navigateForward('/user-guide');
  }

  contactAdmin() {
    window.open('mailto:admin@example.com');
  }

  aboutApp() {
    this.navCtrl.navigateForward('/about');
  }

  // === Logout ===
  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Keluar',
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Keluar',
          handler: () => {
            localStorage.clear(); // atau storage.clear()
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
  goTo(route: string) {
    switch (route) {
      case 'perusahaan':
        this.router.navigate(['/about']);
        break;
      case 'beranda':
        this.router.navigate(['/dashboard']);
        break;
      case 'akun':
        this.router.navigate(['/akun']);
        break;
      default:
        console.warn('Rute tidak dikenali:', route);
    }
  }
}

