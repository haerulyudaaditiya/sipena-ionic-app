import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
  standalone: false,
})
export class ProfilePopoverComponent implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit(): void {
    // logika inisialisasi bisa ditambahkan di sini jika diperlukan
  }

  goToProfile() {
    this.popoverCtrl.dismiss();
    setTimeout(() => {
      this.navCtrl.navigateForward('/profile');
    }, 100); // delay 100ms agar focus berpindah dulu
  }

  changepassword() {
    this.popoverCtrl.dismiss();
    setTimeout(() => {
      this.navCtrl.navigateForward('/ganti-password');
    }, 100);
  }

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
            localStorage.clear();
            this.popoverCtrl.dismiss();
            setTimeout(() => {
              this.navCtrl.navigateRoot('/login');
            }, 100);
          }
        }
      ]
    });

    await alert.present();
  }
}
