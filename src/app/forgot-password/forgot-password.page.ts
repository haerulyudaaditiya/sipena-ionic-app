import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {
  pageState: 'enter_email' | 'verify_otp' = 'enter_email';
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  isLoading: boolean = false;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';

  constructor(
    private router: Router,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private loadingCtrl: LoadingController,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  async requestOtp() {
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.showCustomAlert('warning', 'Gagal', 'Mohon masukkan alamat email yang valid.');
      return;
    }

    this.isLoading = true;
    const loading = await this.presentLoading('Mengirim Kode OTP...');

    try {
      await firstValueFrom(this.authService.requestOtp(this.email));
      await loading.dismiss();
      this.pageState = 'verify_otp';

    } catch (error: any) {
      await loading.dismiss();
      this.showCustomAlert('danger', 'Gagal', error.error?.message || 'Gagal mengirim OTP. Pastikan email terdaftar.');
    } finally {
      this.isLoading = false;
    }
  }

  async resetPassword() {
    if (!this.otp || this.otp.length !== 6) {
      this.showCustomAlert('warning', 'Gagal', 'Kode OTP harus 6 digit.');
      return;
    }
    if (!this.newPassword || this.newPassword.length < 8) {
      this.showCustomAlert('warning', 'Gagal', 'Password baru minimal harus 8 karakter.');
      return;
    }

    this.isLoading = true;
    const loading = await this.presentLoading('Mereset password...');

    try {
      const payload = { email: this.email, otp: this.otp, password: this.newPassword };
      await firstValueFrom(this.authService.resetPassword(payload));

      await loading.dismiss();
      await this.showCustomAlert(
        'success',
        'Sukses',
        'Password Anda telah berhasil direset. Silakan login kembali.',
        () => {
            this.router.navigate(['/login']);
        }
      );

    } catch (error: any) {
      await loading.dismiss();
      this.showCustomAlert('danger', 'Gagal', error.error?.message || 'Kode OTP salah atau telah kedaluwarsa.');
    } finally {
      this.isLoading = false;
    }
  }

  goBack() {
    if (this.pageState === 'verify_otp') {
      this.pageState = 'enter_email';
    } else {
      this.location.back();
    }
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon =
      this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({ message, spinner: 'crescent' });
    await loading.present();
    return loading;
  }

  /**
   * DITAMBAHKAN: Fungsi helper baru untuk menampilkan alert kustom
   */
  async showCustomAlert(type: 'success'|'danger'|'warning'|'primary', header: string, message: string, okHandler?: () => void) {
    const iconMap = {
        success: 'checkmark-circle-outline',
        danger: 'alert-circle-outline',
        warning: 'warning-outline',
        primary: 'information-circle-outline'
    };
    
    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: iconMap[type],
        alertType: type,
        headerText: header,
        messageText: message,
        confirmButton: { text: 'OK' }
      },
      cssClass: 'custom-alert-modal'
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm' && okHandler) {
      okHandler();
    }
  }
}
