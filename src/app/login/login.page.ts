import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { PushNotificationService } from '../services/push-notification.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false
})
export class LoginPage {
  email: string = '';
  password: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private pushNotificationService: PushNotificationService
  ) {}

  /**
   * DIUBAH: Menggunakan async/await penuh, loading indicator, dan modal kustom
   */
  async doSubmit() {
    if (!this.email || !this.password) {
      this.showCustomAlert('warning', 'Login Gagal', 'Email dan password tidak boleh kosong.');
      return;
    }

    this.isLoading = true;
    const loading = await this.presentLoading('Harap tunggu...');

    try {
      const response = await firstValueFrom(this.authService.login(this.email, this.password));

      if (response && response.token) {
        // Panggil service untuk menyimpan token dan data user
        this.authService.saveToken(response.token, response.user);
        
        await this.pushNotificationService.sendTokenToServer();

        await loading.dismiss();
        this.router.navigateByUrl('/dashboard');
      } else {
        // Ini adalah kasus jika API sukses (status 200) tapi tidak mengembalikan token
        throw new Error('Respon tidak valid dari server.');
      }
    } catch (error: any) {
      await loading.dismiss();
      const errorMessage = error.error?.message || 'Email atau password yang Anda masukkan salah.';
      this.showCustomAlert('danger', 'Login Gagal', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  // Fungsi untuk toggle visibilitas password
  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  // --- Helper Functions ---
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
