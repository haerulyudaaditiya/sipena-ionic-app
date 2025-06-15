import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async resetPassword() {
    const trimmedNew = this.newPassword.trim();
    const trimmedConfirm = this.confirmPassword.trim();

    if (!trimmedNew || !trimmedConfirm) {
      const alert = await this.alertCtrl.create({
        header: 'Peringatan',
        message: 'Semua kolom harus diisi.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (trimmedNew.length < 6) {
      const alert = await this.alertCtrl.create({
        header: 'Peringatan',
        message: 'Password minimal 6 karakter.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      const alert = await this.alertCtrl.create({
        header: 'Kesalahan',
        message: 'Password tidak cocok!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Sukses',
      message: 'Password berhasil diatur ulang.',
      buttons: ['OK'],
    });
    await alert.present();

    this.router.navigate(['/login']);
  }
}
