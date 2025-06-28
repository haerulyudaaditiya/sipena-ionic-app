import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private router: Router, private http: HttpClient) {}

  /**
   * Fungsi utama yang akan dipanggil saat aplikasi dimulai.
   */
  public initPush() {
    // Push notification hanya berjalan di perangkat asli, bukan di browser web
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    // 1. Minta izin dari pengguna untuk menerima notifikasi
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        // Jika diizinkan, daftarkan perangkat ke Firebase
        PushNotifications.register();
      } else {
        // Handle jika pengguna menolak izin
        console.warn('Izin push notification ditolak.');
      }
    });

    // 2. Listener saat pendaftaran berhasil dan mendapatkan token
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('FCM Token Diterima:', token.value);
      // Simpan token secara lokal untuk dikirim setelah login
      await Preferences.set({
        key: 'fcmToken',
        value: token.value,
      });
    });

    // Listener jika terjadi error saat pendaftaran
    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Error on registration: ' + JSON.stringify(error));
    });

    // 3. Listener saat notifikasi diterima KETIKA APLIKASI SEDANG DIBUKA
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        // Anda bisa menampilkan alert atau toast lokal di sini jika diperlukan
      }
    );

    // 4. Listener saat notifikasi DIKETUK oleh pengguna
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Push action performed: ' + JSON.stringify(notification));

        // Logika untuk mengarahkan pengguna ke halaman yang sesuai
        if (data.related_model && data.related_id) {
          if (data.related_model.includes('LeaveRequest')) {
            this.router.navigate(['/detail-cuti', data.related_id]);
          } else if (data.related_model.includes('Salary')) {
            this.router.navigate(['/detail-slip-gaji', data.related_id]);
          }
        }
      }
    );
  }

  /**
   * Mengirim token perangkat ke server Laravel agar bisa disimpan.
   */
  async sendTokenToServer() {
    const authToken = localStorage.getItem('auth_token');
    const { value } = await Preferences.get({ key: 'fcmToken' });

    if (!authToken || !value) {
      console.log('Auth token atau FCM token belum siap. Pengiriman ditunda.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${authToken}` });
    const endpoint = `${environment.apiUrl}/fcm-token`; // Sesuai dengan rute di api.php

    this.http.post(endpoint, { fcm_token: value }, { headers }).subscribe({
      next: async () => {
        console.log('FCM token berhasil dikirim ke server.');
        // Hapus token dari penyimpanan lokal setelah berhasil dikirim
        await Preferences.remove({ key: 'fcmToken' });
      },
      error: (err) => console.error('Gagal mengirim FCM token ke server.', err),
    });
  }
}
