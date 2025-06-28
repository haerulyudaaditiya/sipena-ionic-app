import { Injectable } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  // BehaviorSubject untuk menyimpan status koneksi saat ini.
  // Dimulai dengan 'true' (online).
  private onlineStatus = new BehaviorSubject<boolean>(true);

  constructor() {}

  /**
   * Jalankan fungsi ini sekali saat aplikasi dimulai.
   */
  public initializeNetworkEvents() {
    // Dengarkan perubahan status jaringan
    Network.addListener('networkStatusChange', (status) => {
      console.log('Network status changed', status);
      this.updateOnlineStatus(status.connected);
    });

    // Cek status jaringan saat aplikasi pertama kali dimuat
    this.checkInitialNetworkStatus();
  }

  private async checkInitialNetworkStatus() {
    const status = await Network.getStatus();
    this.updateOnlineStatus(status.connected);
  }

  private updateOnlineStatus(isConnected: boolean) {
    this.onlineStatus.next(isConnected);
  }

  /**
   * Observable yang bisa di-subscribe oleh komponen lain
   * untuk mengetahui status koneksi secara real-time.
   */
  public getOnlineStatus(): Observable<boolean> {
    return this.onlineStatus.asObservable();
  }

  /**
   * Fungsi untuk cek status koneksi saat ini (satu kali).
   */
  public isOnline(): boolean {
    return this.onlineStatus.getValue();
  }
}
