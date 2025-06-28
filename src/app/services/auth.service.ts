import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Ditambahkan 'of' untuk error handling
import { environment } from '../../environments/environment';

// DITAMBAHKAN: Interface untuk payload reset password
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- FUNGSI YANG SUDAH ADA (DENGAN SEDIKIT PENYEMPURNAAN) ---

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, body);
  }

  saveToken(token: string, user: any): void {
    // Disarankan untuk menyimpan semua data sesi di satu tempat
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      // Jika tidak ada token, anggap sudah logout dan selesaikan
      localStorage.clear();
      return of({ status: 'success', message: 'Logged out locally.' });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Hapus data lokal terlebih dahulu untuk UX yang lebih cepat
    localStorage.clear();

    // Kirim request ke API untuk invalidasi token di server
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const token = this.getToken(); // DIUBAH: Menggunakan getToken() untuk konsistensi

    if (!token) {
      return new Observable<any>((observer) => {
        observer.error('User is not authenticated');
      });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    return this.http.post(`${this.apiUrl}/change-password`, body, { headers });
  }

  // --- FUNGSI BARU UNTUK LUPA PASSWORD ---

  /**
   * Meminta OTP untuk reset password.
   * @param email Email pengguna yang terdaftar
   */
  requestOtp(email: string): Observable<any> {
    const payload = { email };
    return this.http.post(`${this.apiUrl}/forgot-password/request-otp`, payload);
  }

  /**
   * Mereset password pengguna dengan OTP yang valid.
   * @param payload Data yang berisi email, otp, dan password baru
   */
  resetPassword(payload: ResetPasswordPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/reset`, payload);
  }
}
