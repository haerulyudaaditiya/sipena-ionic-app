import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ganti-password',
  templateUrl: './ganti-password.page.html',
  styleUrls: ['./ganti-password.page.scss'],
  standalone: false
})
export class GantiPasswordPage implements OnInit {
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private loadingCtrl: LoadingController,
    private location: Location,
    private authService: AuthService
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  /**
   * DIUBAH: Menggunakan async/await dan modal kustom
   */
  async submit() {
    this.passwordForm.markAllAsTouched();
    if (this.passwordForm.invalid) {
      this.showCustomAlert(
        'warning',
        'Gagal',
        'Silakan lengkapi semua kolom dan pastikan konfirmasi password benar.'
      );
      return;
    }

    this.isLoading = true;
    const loading = await this.presentLoading('Memperbarui password...');

    try {
      const { currentPassword, newPassword, confirmPassword } =
        this.passwordForm.value;
      await firstValueFrom(
        this.authService.changePassword(
          currentPassword,
          newPassword,
          confirmPassword
        )
      );

      await loading.dismiss();
      await this.showCustomAlert(
        'success',
        'Berhasil',
        'Password Anda telah berhasil diperbarui.',
        () => {
          this.passwordForm.reset();
          this.router.navigate(['/dashboard']);
        }
      );
    } catch (error: any) {
      await loading.dismiss();
      const errorMessage =
        error?.error?.message ||
        'Terjadi kesalahan. Pastikan password saat ini benar.';
      this.showCustomAlert('danger', 'Gagal', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  // --- Helper & Navigasi ---
  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  /**
   * DITAMBAHKAN: Fungsi helper baru untuk menampilkan alert kustom
   */
  async showCustomAlert(
    type: 'success' | 'danger' | 'warning' | 'primary',
    header: string,
    message: string,
    okHandler?: () => void
  ) {
    const iconMap = {
      success: 'checkmark-circle-outline',
      danger: 'alert-circle-outline',
      warning: 'warning-outline',
      primary: 'information-circle-outline',
    };

    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: iconMap[type],
        alertType: type,
        headerText: header,
        messageText: message,
        confirmButton: { text: 'OK' },
      },
      cssClass: 'custom-alert-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm' && okHandler) {
      okHandler();
    }
  }

  goBack() {
    this.location.back();
  }
}
