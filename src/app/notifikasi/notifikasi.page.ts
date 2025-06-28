import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';
import { NotificationService } from '../services/notification.service';

// Interface untuk data notifikasi
export interface Notifikasi {
  id: string;
  judul: string;
  tanggal: string;
  isi: string;
  type: 'approval' | 'rejection' | 'warning' | 'info' | 'gaji';
  isRead: boolean;
  relatedModel?: string;
  relatedId?: string;
}

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone: false,
})
export class NotifikasiPage implements OnInit {
  notifikasiList: Notifikasi[] = [];
  // Properti isLoading tidak lagi diperlukan
  // isLoading = true;
  unreadCount = 0;

  constructor(
    private router: Router,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private notificationService: NotificationService
  ) {}

  ionViewWillEnter() {
    this.loadNotifications();
  }

  ngOnInit() {}

  // --- DIUBAH: Menggunakan LoadingController ---
  async loadNotifications(isRefreshing = false) {
    let loading: HTMLIonLoadingElement | null = null;

    // Hanya tampilkan overlay loading saat memuat pertama kali,
    // bukan saat pengguna melakukan pull-to-refresh.
    if (!isRefreshing) {
      loading = await this.loadingCtrl.create({
        message: 'Memuat notifikasi...',
        spinner: 'crescent',
      });
      await loading.present();
    }

    try {
      const response = await firstValueFrom(
        this.notificationService.getNotifications()
      );
      this.notifikasiList = this.mapApiDataToNotifikasi(response.data);
      this.calculateUnreadCount();
    } catch (error) {
      console.error('Gagal memuat notifikasi:', error);
      this.showCustomAlert(
        'danger',
        'Gagal',
        'Tidak dapat mengambil data notifikasi dari server.'
      );
    } finally {
      // Tutup overlay loading jika sedang ditampilkan
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  async handleRefresh(event: any) {
    await this.loadNotifications(true); // Panggil load data dengan status refresh
    event.target.complete(); // Hentikan animasi spinner refresher
  }

  private mapApiDataToNotifikasi(data: any[]): Notifikasi[] {
    return data.map((notif) => {
      const lowerCaseTitle = notif.title.toLowerCase();
      let type: Notifikasi['type'] = 'info';

      if (lowerCaseTitle.includes('disetujui')) type = 'approval';
      else if (lowerCaseTitle.includes('ditolak')) type = 'rejection';
      else if (lowerCaseTitle.includes('terlambat')) type = 'warning';
      else if (lowerCaseTitle.includes('gaji')) type = 'gaji';

      return {
        id: notif.id,
        judul: notif.title,
        tanggal: notif.created_at,
        isi: notif.message,
        type: type,
        isRead: notif.status === 'read',
        relatedModel: notif.related_model,
        relatedId: notif.related_id,
      };
    });
  }

  private calculateUnreadCount() {
    this.unreadCount = this.notifikasiList.filter((n) => !n.isRead).length;
  }

  async handleNotificationTap(notifikasi: Notifikasi) {
    if (!notifikasi.isRead) {
      notifikasi.isRead = true;
      this.calculateUnreadCount();
      try {
        await firstValueFrom(
          this.notificationService.markAsRead(notifikasi.id)
        );
      } catch (error) {
        console.error('Gagal menandai notifikasi di server:', error);
        notifikasi.isRead = false;
        this.calculateUnreadCount();
      }
    }

    if (notifikasi.relatedModel && notifikasi.relatedId) {
      if (notifikasi.relatedModel.includes('LeaveRequest')) {
        this.router.navigate(['/detail-cuti', notifikasi.relatedId]);
      } else if (notifikasi.relatedModel.includes('Salary')) {
        this.router.navigate(['/detail-slip-gaji', notifikasi.relatedId]);
      }
    }
  }

  formatTanggal(tanggal: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(tanggal).toLocaleString('id-ID', options);
  }

  getIconForNotif(type: string): string {
    switch (type) {
      case 'approval':
        return 'checkmark-circle-outline';
      case 'rejection':
        return 'close-circle-outline';
      case 'warning':
        return 'alert-circle-outline';
      case 'gaji':
        return 'wallet-outline';
      default:
        return 'notifications-outline';
    }
  }

  goBack() {
    this.location.back();
  }

  async showCustomAlert(
    type: 'success' | 'danger' | 'warning' | 'primary',
    header: string,
    message: string,
    okHandler?: () => void
  ) {
    const iconMap = {
      success: 'checkmark-circle-outline',
      danger: 'alert-circle-outline',
      warning: 'warning-outline',
      primary: 'information-circle-outline',
    };

    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: iconMap[type],
        alertType: type,
        headerText: header,
        messageText: message,
        confirmButton: { text: 'OK' },
      },
      cssClass: 'custom-alert-modal',
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm' && okHandler) {
      okHandler();
    }
  }
}
