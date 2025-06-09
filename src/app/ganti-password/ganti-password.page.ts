import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ganti-password',
  templateUrl: './ganti-password.page.html',
  styleUrls: ['./ganti-password.page.scss'],
  standalone: false
})
export class GantiPasswordPage implements OnInit {
  passwordForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private location: Location
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
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

  async submit() {
    if (this.passwordForm.invalid) {
      await this.alertCtrl.create({
        header: 'Gagal',
        message: 'Silakan lengkapi semua kolom dan pastikan konfirmasi password benar.',
        buttons: ['OK']
      }).then(alert => alert.present());
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    // TODO: Simpan ke API kalau perlu
    console.log('Password diganti:', { currentPassword, newPassword });

    await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Password berhasil diperbarui.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.passwordForm.reset();
          this.router.navigate(['/dashboard']);
        }
      }]
    }).then(alert => alert.present());
  }

  goTo(route: string) {
    if (route === 'beranda') {
      this.router.navigate(['/dashboard']);
    }
  }
  goBack() {
    this.location.back();
  }
}
