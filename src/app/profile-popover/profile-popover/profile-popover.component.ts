import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component'; // Import komponen alert kustom

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
  standalone: false,
})
export class ProfilePopoverComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private navCtrl: NavController,
    private location: Location,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit(): void {
    // logika inisialisasi Anda tetap di sini
  }

  // Fungsi goToProfile() tidak diubah
  goToProfile() {
    this.popoverCtrl.dismiss();
    setTimeout(() => {
      this.navCtrl.navigateForward('/profile');
    }, 100);
  }

  // Fungsi changepassword() tidak diubah
  changepassword() {
    this.popoverCtrl.dismiss();
    setTimeout(() => {
      this.navCtrl.navigateForward('/ganti-password');
    }, 100);
  }

  /**
   * DIUBAH: Hanya bagian ini yang diubah untuk menggunakan modal kustom
   */
  async logout() {
    // Tutup popover terlebih dahulu
    await this.popoverCtrl.dismiss();

    // Membuat dan menampilkan modal kustom
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

    // Menunggu hasil dari modal
    const { data } = await modal.onDidDismiss();

    // Menjalankan logika logout asli Anda jika pengguna menekan "Keluar"
    if (data && data.role === 'confirm') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');

      await Preferences.remove({ key: 'isLoggedIn' });
      await Preferences.remove({ key: 'email' });
      await Preferences.remove({ key: 'password' });

      this.navCtrl.navigateRoot('/login', { replaceUrl: true });
    }
  }
}
