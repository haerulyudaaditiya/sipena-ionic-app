import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { LeaveRequestService } from '../../services/leave-request.service';

// Interface untuk data detail cuti
export interface LeaveRequestDetail {
  id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  contact: string | null;
  rejection_reason: string | null;
  type_in_indonesian: string;
  statusColor: string;
  statusIcon: string;
}

@Component({
  selector: 'app-detail-cuti',
  templateUrl: './detail-cuti.page.html',
  styleUrls: ['./detail-cuti.page.scss'],
  standalone: false
})
export class DetailCutiPage implements OnInit {
  isLoading = true;
  leaveRequestId: string | null = null;
  leaveDetail: LeaveRequestDetail | null = null;
  leaveDuration = 0;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit() {
    this.leaveRequestId = this.route.snapshot.paramMap.get('id');
    if (this.leaveRequestId) {
      this.loadLeaveRequestDetail();
    } else {
      this.handleError('ID Pengajuan Cuti tidak valid.');
    }
  }

  async loadLeaveRequestDetail() {
    this.isLoading = true;
    const loading = await this.presentLoading('Memuat detail...');

    try {
      const response = await firstValueFrom(
        this.leaveRequestService.getDetail(this.leaveRequestId!)
      );
      this.leaveDetail = this.processLeaveData(response.data);
      this.calculateLeaveDuration();
    } catch (error) {
      this.handleError('Tidak dapat mengambil detail pengajuan cuti.');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  processLeaveData(data: any): LeaveRequestDetail {
    const getIndonesianType = (type: string): string => {
      const typeMap: { [key: string]: string } = {
        annual: 'Cuti Tahunan',
        sick: 'Izin Sakit',
        personal: 'Keperluan Pribadi',
        other: 'Lainnya',
      };
      return typeMap[type] || 'Cuti';
    };

    const statusMap: {
      [key: string]: { color: string; icon: string; text: string };
    } = {
      approved: {
        color: 'success',
        icon: 'checkmark-circle',
        text: 'Disetujui',
      },
      rejected: { color: 'danger', icon: 'close-circle', text: 'Ditolak' },
      pending: { color: 'warning', icon: 'hourglass', text: 'Menunggu' },
    };

    return {
      ...data,
      type_in_indonesian: getIndonesianType(data.type),
      statusColor: statusMap[data.status]?.color || 'primary',
      statusIcon: statusMap[data.status]?.icon || 'help-circle',
      status: statusMap[data.status]?.text || 'Unknown',
      rejection_reason: data.rejection_reason,
    };
  }

  calculateLeaveDuration() {
    if (this.leaveDetail?.start_date && this.leaveDetail?.end_date) {
      const start = new Date(this.leaveDetail.start_date);
      const end = new Date(this.leaveDetail.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      this.leaveDuration = diffDays;
    }
  }

  goBack() {
    this.location.back();
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

  handleError(message: string) {
    console.error(message);
    this.showCustomAlert('danger', 'Error', message, () => this.goBack());
  }

  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
  }
}
