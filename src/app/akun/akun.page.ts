import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-akun',
  templateUrl: './akun.page.html',
  styleUrls: ['./akun.page.scss'],
  standalone: false,
})
export class AkunPage implements OnInit {

  activeRoute: string = '';

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private location: Location
  ) {
     this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.activeRoute = (event as NavigationEnd).urlAfterRedirects;
    });
  }

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
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Keluar',
          handler: async () => {
            await Preferences.remove({ key: 'isLoggedIn' }); // Hapus status login
            await Preferences.remove({ key: 'email' });
            await Preferences.remove({ key: 'password' });

            this.location.replaceState('/'); // Reset history
            this.navCtrl.navigateRoot('/login', { replaceUrl: true }); // Kembali ke login
          }
        }
      ]
    });
    await alert.present();
  }

  goTo(route: string) {
    switch (route) {
      case 'beranda':
        this.router.navigate(['/dashboard']);
        break;
      case 'presensi':
        this.router.navigate(['/presensi']);
        break;
      case 'akun':
        this.router.navigate(['/akun']);
        break;
      default:
        console.warn('Rute tidak dikenali:', route);
    }
  }

  goBack() {
    this.location.back();
  }
}

