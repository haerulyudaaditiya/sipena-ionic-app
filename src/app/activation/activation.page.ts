import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  // Import ActivatedRoute untuk mengambil queryParams
import { ActivationService } from '../services/activation.service';  // Import ActivationService
import { Router } from '@angular/router';  // Import Router untuk navigasi

@Component({
  selector: 'app-activation',
  templateUrl: './activation.page.html',
  styleUrls: ['./activation.page.scss'],
  standalone: false,
})
export class ActivationPage implements OnInit {
  token: string = '';  // Initialize token property with an empty string
  password: string = '';
  password_confirmation: string = '';

  constructor(private activatedRoute: ActivatedRoute, private activationService: ActivationService, private router: Router) {}

  ngOnInit() {
    // Ambil token dari queryParams
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params['token']) {  // Access 'token' using bracket notation
        this.token = params['token'];  // Menyimpan token
        console.log('Token:', this.token);
      }
    });
  }

  // Tangani pengaturan password dan aktivasi
  setPassword() {
    if (this.password !== this.password_confirmation) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    // Panggil ActivationService untuk mengatur password
    this.activationService.setPassword(this.token, this.password, this.password_confirmation)
      .subscribe(response => {
        if (response.success) {
          alert('Password berhasil diatur!');
          this.router.navigate(['/home']);
        } else {
          alert('Gagal mengatur password: ' + response.message);
        }
      }, error => {
        alert('Terjadi kesalahan: ' + error.message);
      });
  }
}