import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { CustomAlertComponent } from '../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { SalaryService } from '../services/salary.service';

export interface SalaryHistoryItem {
  id: string;
  salary_date: string;
  net_salary: number;
}

@Component({
  selector: 'app-slip-gaji',
  templateUrl: './slip-gaji.page.html',
  styleUrls: ['./slip-gaji.page.scss'],
  standalone: false
})
export class SlipGajiPage implements OnInit {
  isLoading = true;
  masterSalaryHistory: SalaryHistoryItem[] = [];
  filteredSalaryHistory: SalaryHistoryItem[] = [];

  searchTerm = '';
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  months: { label: string; value: number }[] = [];
  years: number[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.generateFilterOptions();
    this.loadSalaryHistory();
  }

  async loadSalaryHistory() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Memuat riwayat gaji...',
    });
    await loading.present();

    try {
      const response = await firstValueFrom(
        this.salaryService.getSalaryHistory()
      );
      this.masterSalaryHistory = response.data.map((s: any) => ({
        ...s,
        net_salary: parseFloat(s.net_salary),
      }));

      this.filteredSalaryHistory = this.masterSalaryHistory;
    } catch (error) {
      // DIUBAH: Memanggil custom alert
      this.showCustomAlert(
        'danger',
        'Gagal Memuat',
        'Terjadi kesalahan saat mengambil data.'
      );
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  // Logika filter dan search Anda tidak diubah
  runFiltersAndSearch() {
    let result = this.masterSalaryHistory;
    if (this.selectedYear) {
      result = result.filter(
        (item) => new Date(item.salary_date).getFullYear() === this.selectedYear
      );
    }
    if (this.selectedMonth) {
      result = result.filter(
        (item) =>
          new Date(item.salary_date).getMonth() + 1 === this.selectedMonth
      );
    }
    const searchTermLower = this.searchTerm.toLowerCase();
    if (searchTermLower) {
      result = result.filter((item) => {
        const periode = new Date(item.salary_date)
          .toLocaleString('id-ID', { month: 'long', year: 'numeric' })
          .toLowerCase();
        return periode.includes(searchTermLower);
      });
    }
    this.filteredSalaryHistory = result;
  }

  resetFilters() {
    this.selectedMonth = null;
    this.selectedYear = null;
    this.searchTerm = '';
    this.filteredSalaryHistory = this.masterSalaryHistory;
  }

  goToDetail(salaryId: string) {
    this.router.navigate(['/detail-slip-gaji', salaryId]);
  }

  private generateFilterOptions() {
    this.months = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(0, i).toLocaleString('id-ID', { month: 'long' }),
      value: i + 1,
    }));
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  goBack() {
    this.location.back();
  }

  // DIHAPUS: Fungsi presentAlert yang lama

  // DITAMBAHKAN: Fungsi helper baru untuk menampilkan alert kustom
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
