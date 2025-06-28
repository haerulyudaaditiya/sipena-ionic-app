import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Mengambil pengumuman terbaru dari server.
   */
  getLatestAnnouncement(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token otentikasi tidak ditemukan.');
    }
    
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(`${this.apiUrl}/announcements/latest`, { headers });
  }
}
