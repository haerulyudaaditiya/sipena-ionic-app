import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { ModalController, NavController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { filter } from 'rxjs/operators';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom

@Component({
  selector: 'app-akun',
  templateUrl: './akun.page.html',
  styleUrls: ['./akun.page.scss'],
  standalone: false,
})
export class AkunPage implements OnInit {
  activeRoute: string = '';

  constructor(
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
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

  // === Fungsi-fungsi navigasi Anda tidak diubah ===
  goToProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  changePassword() {
    this.navCtrl.navigateForward('/ganti-password');
  }

  changeLanguage() {
    // Anda perlu membuat halaman ini
    // this.navCtrl.navigateForward('/language-settings');
    console.log('Navigasi ke halaman ganti bahasa');
  }

  openGuide() {
    this.navCtrl.navigateForward('/user-guide');
  }

  contactAdmin() {
    window.open('mailto:support@sipenacorp.com');
  }

  aboutApp() {
    this.navCtrl.navigateForward('/about');
  }

  // === DIUBAH: Fungsi Logout kini menggunakan modal kustom ===
  async logout() {
    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: 'log-out-outline',
        alertType: 'danger',
        headerText: 'Konfirmasi Keluar',
        messageText: 'Apakah Anda yakin ingin keluar dari akun?',
        cancelButton: { text: 'Batal' },
        confirmButton: { text: 'Keluar' },
      },
      cssClass: 'custom-alert-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm') {
      // Logika logout Anda yang asli dipindahkan ke sini
      localStorage.clear();
      await Preferences.clear();
      this.navCtrl.navigateRoot('/login', { replaceUrl: true });
    }
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
