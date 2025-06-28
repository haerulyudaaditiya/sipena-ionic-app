import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular'; // DIUBAH: AlertController diganti ModalController
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CustomAlertComponent } from '../../components/custom-alert/custom-alert.component'; // Import komponen alert kustom
import { SalaryService } from '../../services/salary.service';

// Interface untuk data detail gaji
export interface SalaryDetail {
  id: string;
  salary_date: string;
  basic_salary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  net_salary: number;
}

@Component({
  selector: 'app-detail-slip-gaji',
  templateUrl: './detail-slip-gaji.page.html',
  styleUrls: ['./detail-slip-gaji.page.scss'],
  standalone: false
})
export class DetailSlipGajiPage implements OnInit {
  isLoading = true;
  salaryId: string | null = null;
  salaryDetail: SalaryDetail | null = null;
  totalPenerimaan = 0;
  activeRoute: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, // DIUBAH: Menggunakan ModalController
    private salaryService: SalaryService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit() {
    this.salaryId = this.route.snapshot.paramMap.get('id');
    if (this.salaryId) {
      this.loadSalaryDetail();
    } else {
      console.error('ID Slip Gaji tidak ditemukan');
      // DIUBAH: Memanggil handleError yang menggunakan custom alert
      this.handleError('Gagal memuat detail, ID tidak ditemukan.');
    }
  }

  async loadSalaryDetail() {
    this.isLoading = true;
    const loading = await this.presentLoading('Memuat detail...');

    try {
      // Logika pemuatan data Anda tetap sama
      const response = await firstValueFrom(
        this.salaryService.getSalaryHistory()
      );
      const allSalaries: any[] = response.data;
      const foundSalary =
        allSalaries.find((s) => s.id === this.salaryId) || null;

      if (foundSalary) {
        this.salaryDetail = {
          id: foundSalary.id,
          salary_date: foundSalary.salary_date,
          basic_salary: parseFloat(foundSalary.basic_salary),
          allowances: parseFloat(foundSalary.allowances),
          bonus: parseFloat(foundSalary.bonus),
          deductions: parseFloat(foundSalary.deductions),
          net_salary: parseFloat(foundSalary.net_salary),
        };

        this.totalPenerimaan =
          this.salaryDetail.basic_salary +
          this.salaryDetail.allowances +
          this.salaryDetail.bonus;
      } else {
        throw new Error('Data slip gaji tidak ditemukan.');
      }
    } catch (error: any) {
      this.handleError(
        error.message || 'Tidak dapat mengambil detail slip gaji.'
      );
    } finally {
      this.isLoading = false;
      await loading.dismiss();
    }
  }

  async download() {
    if (!this.salaryId) {
      this.showCustomAlert(
        'warning',
        'Error',
        'ID Slip Gaji tidak valid untuk diunduh.'
      );
      return;
    }

    const loading = await this.presentLoading('Menyiapkan file...');

    try {
      await this.salaryService.downloadPayslip(this.salaryId);
    } catch (error) {
      console.error('Gagal download PDF:', error);
      this.showCustomAlert(
        'danger',
        'Gagal',
        'Tidak dapat mengunduh file PDF saat ini.'
      );
    } finally {
      await loading.dismiss();
    }
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

  // DITAMBAHKAN KEMBALI: Fungsi navigasi untuk footer
  goTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
