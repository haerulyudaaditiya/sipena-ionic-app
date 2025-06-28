import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Definisikan interface untuk data yang akan dikirim ke API
export interface LeaveRequestPayload {
  type: string;
  start_date: string; // Format YYYY-MM-DD
  end_date: string; // Format YYYY-MM-DD
  reason: string;
  contact?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Helper privat untuk membuat header otentikasi.
   * Ini menghindari duplikasi kode dan lebih mudah dikelola.
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    return new HttpHeaders({'Authorization': `Bearer ${token}`});
  }

  /**
   * Mengirim pengajuan cuti baru ke API
   * @param payload Data pengajuan cuti
   */
  submitRequest(payload: LeaveRequestPayload): Observable<any> {
    const endpoint = `${this.apiUrl}/leave-requests`;
    return this.http.post(endpoint, payload, { headers: this.getHeaders() });
  }

  /**
   * Mengambil riwayat pengajuan cuti dari API
   */
  getHistory(): Observable<any> {
    const endpoint = `${this.apiUrl}/leave-requests/history`;
    return this.http.get(endpoint, { headers: this.getHeaders() });
  }

  /**
   * Mengambil detail satu pengajuan cuti dari API
   */
  getDetail(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/leave-requests/${id}`, { headers: this.getHeaders() });
  }

  /**
   * DITAMBAHKAN: Mengambil ringkasan data cuti dari API untuk dasbor.
   */
  getLeaveSummary(): Observable<any> {
    // Endpoint ini harus sesuai dengan yang Anda daftarkan di routes/api.php
    return this.http.get(`${this.apiUrl}/leave-summary`, { headers: this.getHeaders() });
  }
}
