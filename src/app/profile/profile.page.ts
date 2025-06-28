import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'; // 1. Import LoadingController
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  // Properti isLoading tidak lagi diperlukan untuk menampilkan/menyembunyikan konten
  // employee: any = {}; // Lebih baik diinisialisasi dengan struktur data yang jelas
  employee: any = {
    photo: '',
    name: '',
    position: '',
    employee_id: '',
    npwp: '',
    status: '',
    email: '',
    phone: '',
    department: '',
    address: '',
    hire_date: '',
  };

  employeeId: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private loadingCtrl: LoadingController // 2. Inject LoadingController
  ) {}

  ngOnInit() {
    this.loadEmployeeData();
  }

  // 3. Ubah fungsi menjadi async dan gunakan LoadingController
  async loadEmployeeData() {
    // Membuat dan menampilkan loading overlay
    const loading = await this.loadingCtrl.create({
      message: 'Memuat data profil...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.error('Data user tidak ditemukan di localStorage.');
        // Jangan lupa dismiss loading walaupun terjadi error
        await loading.dismiss();
        return;
      }

      const user = JSON.parse(storedUser);
      this.employeeId = user.employee_id;

      if (!this.employeeId) {
        console.error('Employee ID tidak ditemukan dalam data user.');
        await loading.dismiss();
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.error('Token tidak ditemukan, pengguna belum login.');
        await loading.dismiss();
        return;
      }

      const apiUrl = `${environment.apiUrl}/employees/${this.employeeId}`;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<any>(apiUrl, { headers }).subscribe({
        next: (data) => {
          this.employee = data.employee;
          // Tutup loading setelah data berhasil didapat
          loading.dismiss(); 
        },
        error: (error) => {
          console.error('Error fetching employee data:', error);
          // Tutup loading jika terjadi error
          loading.dismiss();
        }
      });

    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Pastikan loading ditutup jika ada error di luar proses subscribe
      await loading.dismiss();
    }
  }

  getImageUrl(photo: string): string {
    return photo ? `${environment.imageBaseUrl}/${photo}` : '';
  }

  goBack() {
    this.location.back();
  }
}