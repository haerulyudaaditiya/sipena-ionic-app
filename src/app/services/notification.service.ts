import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; // 1. Import HttpParams
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token otentikasi tidak ditemukan.');
    }
    
    // DITAMBAHKAN: Header untuk secara eksplisit melarang caching
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  /**
   * Mengambil semua notifikasi dengan cache-busting.
   */
  getNotifications(): Observable<any> {
    const headers = this.getHeaders();
    // 2. Tambahkan parameter unik (timestamp) untuk membuat setiap URL berbeda
    const params = new HttpParams().set('_', new Date().getTime());
    
    return this.http.get(`${this.apiUrl}/notifications`, { headers, params });
  }

  /**
   * Menandai satu notifikasi sebagai sudah dibaca di server.
   */
  markAsRead(notificationId: string): Observable<any> {
    // PUT request biasanya tidak di-cache, tapi kita tambahkan header untuk konsistensi
    return this.http.put(`${this.apiUrl}/notifications/${notificationId}/read`, {}, { headers: this.getHeaders() });
  }

  /**
   * Mengambil jumlah notifikasi yang belum dibaca dari server.
   */
  getUnreadCount(): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('_', new Date().getTime());
    return this.http.get(`${this.apiUrl}/notifications/unread-count`, { headers, params });
  }
}
