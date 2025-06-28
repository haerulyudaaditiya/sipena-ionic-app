import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { LeaveRequestService } from '../services/leave-request.service';
import { PresensiService } from '../services/presensi.service';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom

export interface RiwayatItem {
  id: string;
  type: 'Absensi' | 'Cuti';
  title: string;
  date: Date;
  description: string;
  status: string;
  statusColor: 'success' | 'warning' | 'danger' | 'primary';
  icon: string;
}

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
  standalone: false
})
export class RiwayatPage implements OnInit {
  isLoading = true;
  masterRiwayat: RiwayatItem[] = [];
  filteredRiwayat: RiwayatItem[] = [];
  searchTerm: string = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  months: { label: string; value: number }[] = [];
  years: number[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private presensiService: PresensiService,
    private leaveRequestService: LeaveRequestService
  ) {}

  ngOnInit() {
    this.generateFilterOptions();
    this.loadAllHistory();
  }

  async loadAllHistory() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Memuat data...',
    });
    await loading.present();

    try {
      const [attendanceData, leaveData] = await Promise.all([
        firstValueFrom(this.presensiService.getHistory()),
        firstValueFrom(this.leaveRequestService.getHistory()),
      ]);

      const mappedAttendances = this.mapAttendanceToRiwayat(
        attendanceData.data
      );
      const mappedLeaves = this.mapLeaveToRiwayat(leaveData.data);

      const combinedData = [...mappedAttendances, ...mappedLeaves];

      combinedData.sort((a, b) => {
        const aIsPending = a.status.toLowerCase() === 'pending';
        const bIsPending = b.status.toLowerCase() === 'pending';

        if (aIsPending && !bIsPending) return -1;
        if (!aIsPending && bIsPending) return 1;

        return b.date.getTime() - a.date.getTime();
      });

      this.masterRiwayat = combinedData;
      this.filteredRiwayat = this.masterRiwayat; // Menampilkan semua data secara default
    } catch (error) {
      console.error('Gagal memuat riwayat:', error);
      // DIUBAH: Memanggil custom alert untuk error
      this.showCustomAlert(
        'danger',
        'Gagal Memuat',
        'Tidak dapat mengambil data riwayat dari server.'
      );
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  // --- Fungsi Mapping Data (Tidak ada perubahan) ---
  private mapAttendanceToRiwayat(attendances: any[]): RiwayatItem[] {
    return attendances.map((att) => ({
      id: att.id,
      type: 'Absensi',
      title: `Absensi ${att.check_out ? 'Keluar' : 'Masuk'}`,
      date: new Date(att.check_in),
      description: `Lokasi: ${att.check_in_location}`,
      status: att.status || 'Tepat Waktu',
      statusColor: att.status === 'Terlambat' ? 'warning' : 'success',
      icon: 'finger-print-outline',
    }));
  }
  private mapLeaveToRiwayat(leaves: any[]): RiwayatItem[] {
    const getIndonesianType = (type: string): string => {
      const typeMap: { [key: string]: string } = {
        annual: 'Cuti Tahunan',
        sick: 'Izin Sakit',
        personal: 'Keperluan Pribadi',
        other: 'Lainnya',
      };
      return typeMap[type] || 'Cuti';
    };
    return leaves.map((leave) => ({
      id: leave.id,
      type: 'Cuti',
      title: `Pengajuan: ${getIndonesianType(leave.type)}`,
      date: new Date(leave.start_date),
      description: leave.reason,
      status: leave.status.charAt(0).toUpperCase() + leave.status.slice(1),
      statusColor:
        leave.status === 'approved'
          ? 'success'
          : leave.status === 'rejected'
          ? 'danger'
          : 'warning',
      icon: 'calendar-outline',
    }));
  }

  // --- DIUBAH: Fungsi lama ditambahkan kembali sebagai pembungkus ---
  applyFilters() {
    this.runFiltersAndSearch();
  }

  applySearch() {
    this.runFiltersAndSearch();
  }

  // --- Logika Filter dan Search Terpadu ---
  private runFiltersAndSearch() {
    let result = this.masterRiwayat;

    // 1. Filter berdasarkan Tahun (jika dipilih)
    if (this.selectedYear) {
      result = result.filter(
        (item) => item.date.getFullYear() === this.selectedYear
      );
    }
    // 2. Filter berdasarkan Bulan (jika dipilih)
    if (this.selectedMonth) {
      result = result.filter(
        (item) => item.date.getMonth() + 1 === this.selectedMonth
      );
    }

    // 3. Filter berdasarkan Pencarian (jika ada)
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower) {
      result = result.filter(
        (item) =>
          item.type.toLowerCase().includes(searchTermLower) ||
          item.title.toLowerCase().includes(searchTermLower) ||
          item.status.toLowerCase().includes(searchTermLower)
      );
    }

    this.filteredRiwayat = result;
  }

  resetFilters() {
    this.selectedMonth = null;
    this.selectedYear = null;
    this.searchTerm = '';
    this.filteredRiwayat = this.masterRiwayat;
  }

  // --- Helper & Navigasi ---
  private generateFilterOptions() {
    this.months = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
      value: i + 1,
    }));
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  goToDetail(item: RiwayatItem) {
    if (item.type === 'Absensi') {
      this.router.navigate(['/detail-absensi', item.id]);
    } else if (item.type === 'Cuti') {
      this.router.navigate(['/detail-cuti', item.id]);
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
