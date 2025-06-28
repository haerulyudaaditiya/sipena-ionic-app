import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import * as L from 'leaflet';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';
import { PresensiService } from '../../services/presensi.service';

@Component({
  selector: 'app-detail-absensi',
  templateUrl: './detail-absensi.page.html',
  styleUrls: ['./detail-absensi.page.scss'],
  standalone: false
})
export class DetailAbsensiPage implements OnInit {
  isLoading = true;
  attendanceId: string | null = null;
  attendanceDetail: any = null;
  workDuration = '';
  private map: L.Map | undefined;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private presensiService: PresensiService
  ) {}

  ngOnInit() {
    this.attendanceId = this.route.snapshot.paramMap.get('id');
    if (this.attendanceId) {
      this.loadAttendanceDetail();
    } else {
      this.handleError('ID Absensi tidak valid.');
    }
  }

  async loadAttendanceDetail() {
    this.isLoading = true;
    const loading = await this.presentLoading('Memuat detail...');

    try {
      const response = await firstValueFrom(
        this.presensiService.getDetail(this.attendanceId!)
      );
      this.attendanceDetail = response.data;

      this.calculateWorkDuration();
      setTimeout(() => this.initMap(), 100);
    } catch (error) {
      this.handleError('Tidak dapat mengambil detail absensi.');
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  getImageUrl(photoPath: string): string {
    const defaultPhotoUrl =
      'https://archive.org/download/instagram-plain-round/instagram%20dip%20in%20hair.jpg';
    if (!photoPath) return defaultPhotoUrl;

    if (photoPath.includes('/storage/')) {
      return `${environment.apiUrl.replace('/api', '')}${photoPath}`;
    } else {
      return `${environment.imageBaseUrl}/${photoPath}`;
    }
  }

  calculateWorkDuration() {
    if (this.attendanceDetail?.check_in && this.attendanceDetail?.check_out) {
      const start = new Date(this.attendanceDetail.check_in).getTime();
      const end = new Date(this.attendanceDetail.check_out).getTime();
      let diff = Math.abs(end - start) / 1000;
      const hours = Math.floor(diff / 3600);
      diff %= 3600;
      const minutes = Math.floor(diff / 60);
      this.workDuration = `${hours} jam ${minutes} menit`;
    }
  }

  initMap() {
    if (
      this.map ||
      !document.getElementById('map-container') ||
      !this.attendanceDetail
    )
      return;
    this.map = L.map('map-container').setView(
      [
        this.attendanceDetail.check_in_latitude,
        this.attendanceDetail.check_in_longitude,
      ],
      15
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
      this.map
    );
    const bounds: L.LatLngExpression[] = [];
    const checkinPoint: L.LatLngExpression = [
      this.attendanceDetail.check_in_latitude,
      this.attendanceDetail.check_in_longitude,
    ];
    L.marker(checkinPoint).addTo(this.map).bindPopup('Lokasi Check-in');
    bounds.push(checkinPoint);
    if (this.attendanceDetail.check_out_latitude) {
      const checkoutPoint: L.LatLngExpression = [
        this.attendanceDetail.check_out_latitude,
        this.attendanceDetail.check_out_longitude,
      ];
      L.marker(checkoutPoint).addTo(this.map).bindPopup('Lokasi Check-out');
      bounds.push(checkoutPoint);
    }
    if (bounds.length > 1) {
      this.map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50] });
    }
  }

  async openImage(photoPath: string | null) {
    if (!photoPath) return;
    const fullUrl = this.getImageUrl(photoPath);
    const modal = await this.modalCtrl.create({
      component: ImageViewerComponent,
      componentProps: { imgSrc: fullUrl },
      cssClass: 'image-viewer-modal',
    });
    await modal.present();
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
