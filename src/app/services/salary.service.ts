import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSalaryHistory(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(`${this.apiUrl}/salaries`, { headers });
  }

  /**
   * DITAMBAHKAN: Method privat untuk meminta link yang aman dari API.
   */
  private getDownloadLink(salaryId: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(`${this.apiUrl}/salaries/${salaryId}/generate-download-link`, { headers });
  }

  /**
   * DIUBAH: Fungsi ini sekarang melakukan 2 langkah.
   */
  async downloadPayslip(salaryId: string) {
    try {
        // Langkah 1: Minta link yang aman dari server
        const response = await firstValueFrom(this.getDownloadLink(salaryId));
        const secureUrl = response.download_url;

        if (!secureUrl) {
            throw new Error('URL unduhan tidak diterima dari server.');
        }

        // Langkah 2: Buka link yang aman tersebut di browser
        await Browser.open({ url: secureUrl });

    } catch (error) {
        console.error("Gagal mendapatkan link unduhan:", error);
        // Lemparkan error agar bisa ditangani di komponen
        throw new Error("Tidak dapat menyiapkan file untuk diunduh.");
    }
  }
}
