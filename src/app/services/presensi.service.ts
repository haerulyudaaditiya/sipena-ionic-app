import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PresensiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('User is not authenticated');
    // Saat mengirim FormData, jangan set Content-Type, biarkan browser yang mengaturnya
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // Helper untuk mengubah dataUrl menjadi Blob (file)
  private dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid dataURL format');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Mengirim data check-in menggunakan FormData.
   */
  async checkIn(employeeId: string, location: string, latitude: number, longitude: number, photoDataUrl: string): Promise<Observable<any>> {
    const formData = new FormData();
    const photoBlob = this.dataUrlToBlob(photoDataUrl);

    formData.append('employee_id', employeeId);
    formData.append('check_in_location', location);
    formData.append('check_in_latitude', latitude.toString());
    formData.append('check_in_longitude', longitude.toString());
    // Menggunakan 3 argumen untuk memastikan tipe file terkirim dengan benar
    formData.append('check_in_photo', photoBlob, `check_in_${Date.now()}.jpg`);

    return this.http.post(`${this.apiUrl}/attendances/check-in`, formData, { headers: this.getAuthHeaders() });
  }

  /**
   * Mengirim data check-out menggunakan FormData.
   */
  async checkOut(attendanceId: string, location: string, latitude: number, longitude: number, photoDataUrl: string): Promise<Observable<any>> {
    const formData = new FormData();
    const photoBlob = this.dataUrlToBlob(photoDataUrl);
    
    // Untuk method PUT/POST dengan FormData, kita gunakan trik dengan _method
    formData.append('_method', 'POST'); // Laravel akan membacanya sebagai PUT/POST
    formData.append('check_out_location', location);
    formData.append('check_out_latitude', latitude.toString());
    formData.append('check_out_longitude', longitude.toString());
    formData.append('check_out_photo', photoBlob, `check_out_${Date.now()}.jpg`);

    return this.http.post(`${this.apiUrl}/attendances/${attendanceId}/check-out`, formData, { headers: this.getAuthHeaders() });
  }
  /**
   * DITAMBAHKAN: Mengambil riwayat absensi dari API
   */
  getHistory(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Asumsi endpoint untuk riwayat absensi adalah ini
    return this.http.get(`${this.apiUrl}/attendances/history`, { headers });
  }

  getDetail(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(`${this.apiUrl}/attendances/${id}`, { headers });
  }

   checkCurrentStatus(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('User not authenticated');
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get(`${environment.apiUrl}/attendances/status`, { headers });
  }
}
