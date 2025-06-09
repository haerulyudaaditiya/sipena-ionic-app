import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isAgreed: boolean = false;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  async doSubmit() {
    if (!this.isAgreed) {
      const alert = await this.alertController.create({
        header: 'Peringatan',
        message: 'Anda harus menyetujui syarat dan ketentuan!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Ganti dengan data valid dari backend jika perlu
    const validEmail = 'rendysuwandi66@gmail.com';
    const validPassword = 'rndy#6604';

    if (this.email === validEmail && this.password === validPassword) {
      // Simpan data jika dibutuhkan
      localStorage.setItem('email', this.email);
      localStorage.setItem('password', this.password);
      this.router.navigateByUrl('/dashboard');
    } else {
      const alert = await this.alertController.create({
        header: 'Login Gagal',
        message: 'Email atau password salah!',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye' ? 'eye-off' : 'eye';
  }
}
