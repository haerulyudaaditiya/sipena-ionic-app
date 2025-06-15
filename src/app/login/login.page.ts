import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  isAgreed = false;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

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

    const validEmail = 'rendysuwandi66@gmail.com';
    const validPassword = 'rndy#6604';

    if (this.email === validEmail && this.password === validPassword) {
      // Simpan status login ke localStorage
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
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

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}

