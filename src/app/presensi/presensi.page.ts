import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController, ModalController } from '@ionic/angular';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { filter, firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component';
import { PresensiService } from '../services/presensi.service';

// Interface untuk data presensi yang lebih terstruktur
interface PresensiData {
  jenis: 'masuk' | 'keluar';
  foto: string;
  waktu: string;
  lokasi: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-presensi',
  templateUrl: './presensi.page.html',
  styleUrls: ['./presensi.page.scss'],
  standalone: false,
})
export class PresensiPage implements OnInit {
  presensiData: PresensiData | null = null;
  activeRoute: string = '';
  attendanceId: string | null = null;
  isLoading: boolean = false;
  isDataReady: boolean = false;
  hasCheckedInToday: boolean = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private loadingController: LoadingController,
    private location: Location,
    private presensiService: PresensiService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit() {
    defineCustomElements(window);
  }

  ionViewWillEnter() {
    this.verifyAttendanceState();
  }

  /**
   * DITAMBAHKAN KEMBALI: Fungsi ini sekarang melakukan verifikasi ke server.
   */
  async verifyAttendanceState() {
    this.isLoading = true;
    try {
      console.log('Memverifikasi status presensi ke server...');
      const response = await firstValueFrom(
        this.presensiService.checkCurrentStatus()
      );
      const attendanceData = response.data;

      console.log('Respons dari server:', attendanceData);

      if (attendanceData && attendanceData.id) {
        console.log('Status: Sudah Check-in');
        this.hasCheckedInToday = true;
        this.attendanceId = attendanceData.id;
        this.saveVerifiedAttendance(attendanceData.id, attendanceData.check_in);
      } else {
        console.log('Status: Belum Check-in');
        this.hasCheckedInToday = false;
        this.attendanceId = null;
        localStorage.removeItem('currentAttendance');
      }
    } catch (error) {
      console.error('Gagal verifikasi status presensi:', error);
      this.hasCheckedInToday = false;
      this.attendanceId = null;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * DITAMBAHKAN KEMBALI: Fungsi untuk menyimpan data yang sudah terverifikasi.
   */
  private saveVerifiedAttendance(id: string, date: string) {
    const attendanceData = { id: id, date: date };
    localStorage.setItem('currentAttendance', JSON.stringify(attendanceData));
  }

  async ambilPresensi(jenis: 'masuk' | 'keluar') {
    if (this.hasCheckedInToday && jenis === 'masuk') {
      this.showCustomAlert(
        'primary',
        'Info',
        'Anda sudah melakukan check-in hari ini.'
      );
      return;
    }
    if (!this.hasCheckedInToday && jenis === 'keluar') {
      this.showCustomAlert(
        'primary',
        'Info',
        'Anda harus check-in terlebih dahulu.'
      );
      return;
    }

    const loading = await this.presentLoading('Menyiapkan presensi...');
    this.isLoading = true;

    try {
      const cameraPermission = await Camera.requestPermissions();
      if (cameraPermission.camera !== 'granted') {
        throw new Error(
          'Izin kamera ditolak. Aplikasi tidak dapat melanjutkan.'
        );
      }

      const locationPermission = await Geolocation.requestPermissions();
      if (locationPermission.location !== 'granted') {
        throw new Error(
          'Izin lokasi ditolak. Aplikasi tidak dapat melanjutkan.'
        );
      }

      loading.message = 'Mendapatkan lokasi...';
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      const { latitude, longitude } = position.coords;

      loading.message = 'Membuka kamera...';
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image.dataUrl)
        throw new Error('Gagal mendapatkan data gambar dari kamera.');

      this.presensiData = {
        jenis,
        foto: image.dataUrl,
        waktu: new Date().toLocaleString('id-ID', { hour12: false }),
        lokasi: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        latitude,
        longitude,
      };
      this.isDataReady = true;
    } catch (err: any) {
      let errorMessage = 'Gagal memproses presensi. Silakan coba lagi.';
      let errorHeader = 'Terjadi Kesalahan';

      // Cek untuk pesan error spesifik dari Geolocation
      if (
        err.message &&
        err.message.toLowerCase().includes('location services are not enabled')
      ) {
        errorHeader = 'Layanan Lokasi Mati';
        errorMessage =
          'Mohon aktifkan layanan lokasi (GPS) di perangkat Anda untuk dapat melanjutkan.';
      }
      // Cek untuk pesan error spesifik jika izin ditolak
      else if (
        err.message &&
        err.message.toLowerCase().includes('permission was denied')
      ) {
        errorHeader = 'Izin Dibutuhkan';
        errorMessage =
          'Aplikasi memerlukan izin lokasi. Mohon aktifkan melalui Pengaturan HP Anda.';
      }
      // Jangan tampilkan alert jika pengguna hanya membatalkan dialog kamera
      else if (err.message && err.message.toLowerCase().includes('cancelled')) {
        return; // Keluar dari fungsi tanpa menampilkan apa-apa
      }

      this.showCustomAlert('danger', errorHeader, errorMessage);
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  // --- Fungsi yang sudah ada (tidak diubah) ---
  async onKirimPresensi() {
    if (!this.presensiData) return;
    const modal = await this.modalCtrl.create({
      component: CustomAlertComponent,
      componentProps: {
        icon: 'help-circle-outline',
        alertType: 'primary',
        headerText: 'Konfirmasi Presensi',
        messageText: `Anda yakin ingin mengirim presensi ${this.presensiData.jenis}?`,
        cancelButton: { text: 'Batal' },
        confirmButton: { text: 'Ya, Kirim' },
      },
      cssClass: 'custom-alert-modal',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data && data.role === 'confirm') {
      this.executeSendPresensi();
    }
  }

  async executeSendPresensi() {
    if (!this.presensiData) return;
    const loading = await this.presentLoading('Mengirim data...');
    this.isLoading = true;
    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (!user?.employee_id)
        throw new Error('ID Karyawan tidak ditemukan. Silakan login ulang.');
      const { jenis, foto, lokasi, latitude, longitude } = this.presensiData;
      let newAttendanceId: string;
      if (jenis === 'masuk') {
        const response: any = await firstValueFrom(
          await this.presensiService.checkIn(
            user.employee_id,
            lokasi,
            latitude,
            longitude,
            foto
          )
        );
        newAttendanceId = response.attendance?.id;
        this.attendanceId = newAttendanceId;
        this.hasCheckedInToday = true;
        this.saveVerifiedAttendance(
          newAttendanceId,
          response.attendance.check_in
        );
      } else {
        if (!this.attendanceId)
          throw new Error(
            'Gagal check-out: Anda belum melakukan check-in hari ini.'
          );
        newAttendanceId = this.attendanceId;
        await firstValueFrom(
          await this.presensiService.checkOut(
            this.attendanceId,
            lokasi,
            latitude,
            longitude,
            foto
          )
        );
        localStorage.removeItem('currentAttendance');
      }
      await loading.dismiss();
      this.showCustomAlert(
        'success',
        'Sukses',
        `Presensi ${jenis} berhasil!`,
        () => {
          this.router.navigate(['/detail-absensi', newAttendanceId]);
          this.resetPresensiData();
        }
      );
    } catch (error: any) {
      await loading.dismiss();
      const errorMsg =
        error.error?.message ||
        error.message ||
        'Terjadi kesalahan pada server.';
      this.showCustomAlert('danger', 'Gagal', errorMsg);
    } finally {
      this.isLoading = false;
    }
  }

  resetPresensiData() {
    this.presensiData = null;
    this.isDataReady = false;
  }
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    await loading.present();
    return loading;
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
  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
  goBack() {
    this.location.back();
  }
}
