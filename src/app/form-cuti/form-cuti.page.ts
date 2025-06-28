import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import {
  LeaveRequestPayload,
  LeaveRequestService,
} from '../services/leave-request.service';

@Component({
  selector: 'app-form-cuti',
  templateUrl: './form-cuti.page.html',
  styleUrls: ['./form-cuti.page.scss'],
  standalone: false
})
export class FormCutiPage implements OnInit {
  // Properti yang sudah Anda miliki
  jenisCuti: string = '';
  startTime: string = '';
  endTime: string = '';
  alasan: string = '';
  kontakCuti: string = '';

  showStartTimePicker = false;
  showEndTimePicker = false;

  tempStartTime: string = '';
  tempEndTime: string = '';

  isLoading = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private loadingController: LoadingController,
    private location: Location,
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit() {}

  // --- Logika Pemilih Tanggal (Tetap sama) ---
  onTempStartTimeChange(event: any) {
    this.tempStartTime = event.detail.value;
  }
  onTempEndTimeChange(event: any) {
    this.tempEndTime = event.detail.value;
  }
  confirmStartTime() {
    if (this.tempStartTime) {
      this.startTime = this.formatDateOnly(new Date(this.tempStartTime));
    }
    this.showStartTimePicker = false;
  }
  confirmEndTime() {
    if (this.tempEndTime) {
      this.endTime = this.formatDateOnly(new Date(this.tempEndTime));
    }
    this.showEndTimePicker = false;
  }
  formatDateOnly(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('id-ID', options);
  }

  // --- FUNGSI UTAMA YANG DIPERBAIKI ---
  async ajukanCuti() {
    // --- Blok Validasi Detail ---
    if (!this.jenisCuti) {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Mohon pilih jenis cuti.'
      );
      return;
    }
    if (!this.tempStartTime) {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Mohon tentukan tanggal mulai cuti.'
      );
      return;
    }
    if (!this.tempEndTime) {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Mohon tentukan tanggal selesai cuti.'
      );
      return;
    }
    if (!this.alasan || this.alasan.trim() === '') {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Alasan pengajuan harus diisi.'
      );
      return;
    }

    const startDate = new Date(this.tempStartTime);
    const endDate = new Date(this.tempEndTime);
    const today = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Tanggal mulai cuti tidak boleh tanggal yang sudah lewat.'
      );
      return;
    }
    if (endDate < startDate) {
      this.showCustomAlert(
        'warning',
        'Validasi Gagal',
        'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.'
      );
      return;
    }

    const getApiType = (type: string): string => {
      const typeMap: { [key: string]: string } = {
        Tahunan: 'annual',
        Sakit: 'sick',
        Izin: 'personal',
        Lainnya: 'other',
      };
      return typeMap[type] || '';
    };
    const apiTypeValue = getApiType(this.jenisCuti);

    this.isLoading = true;
    const loading = await this.presentLoading('Mengirim pengajuan...');

    try {
      const payload: LeaveRequestPayload = {
        type: apiTypeValue,
        start_date: this.tempStartTime.split('T')[0],
        end_date: this.tempEndTime.split('T')[0],
        reason: this.alasan,
        contact: this.kontakCuti,
      };

      const response = await firstValueFrom(
        this.leaveRequestService.submitRequest(payload)
      );
      const newLeaveRequestId = response.data?.id;

      await loading.dismiss();

      if (newLeaveRequestId) {
        await this.showCustomAlert(
          'success',
          'Sukses',
          'Pengajuan cuti Anda telah berhasil dikirim.',
          () => {
            this.resetForm();
            this.router.navigate(['/detail-cuti', newLeaveRequestId]);
          }
        );
      } else {
        await this.showCustomAlert(
          'success',
          'Sukses',
          'Pengajuan berhasil, namun gagal menampilkan detail.',
          () => {
            this.resetForm();
            this.router.navigate(['/riwayat']);
          }
        );
      }
    } catch (error: any) {
      await loading.dismiss();
      const errorMessage =
        error.error?.message ||
        error.message ||
        'Terjadi kesalahan pada server.';
      this.showCustomAlert('danger', 'Gagal Mengirim', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.jenisCuti = '';
    this.startTime = '';
    this.endTime = '';
    this.alasan = '';
    this.kontakCuti = '';
    this.tempStartTime = '';
    this.tempEndTime = '';
  }

  // --- Helper & Navigasi ---
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }

  /**
   * DITAMBAHKAN: Fungsi helper baru untuk menampilkan alert kustom
   */
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

  goBack() {
    this.location.back();
  }
}
