import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false,
})
export class ForgotPasswordPage implements OnInit {
  emailOrNik: string = '';

  constructor(
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  async sendResetLink() {
    const trimmedInput = this.emailOrNik.trim();

    if (!trimmedInput) {
      const alert = await this.alertCtrl.create({
        header: 'Peringatan',
        message: 'Silakan masukkan email atau NIK.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Tautan reset telah dikirim ke email/NIK Anda.',
      buttons: ['OK'],
    });
    await alert.present();

    this.router.navigate(['/reset-password']);
  }
}
