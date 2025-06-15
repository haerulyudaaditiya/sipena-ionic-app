import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Platform, ToastController } from '@ionic/angular';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';


declare var html2pdf: any;

@Component({
  selector: 'app-slip-gaji',
  templateUrl: './slip-gaji.page.html',
  styleUrls: ['./slip-gaji.page.scss'],
  standalone: false,
  providers: [File, FileOpener]
})
export class SlipGajiPage implements OnInit {
  months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  years = [2023, 2024, 2025];
  selectedMonth: string | null = null;
  selectedYear: number | null = null;
  slipVisible = false;

  constructor(
    private router: Router,
    private location: Location,
    private platform: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private toastCtrl: ToastController,
  ) {}

   ngOnInit() {

  }

  async generateAndOpenPDF() {
    try {
      this.slipVisible = true;

      const element = document.getElementById('slipGaji');
      if (!element) {
        this.showToast('Element PDF tidak ditemukan');
        this.slipVisible = false;
        return;
      }

      const opt = {
        margin: 0.5,
        filename: 'slip-gaji.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      const pdfBlob: Blob = await html2pdf().set(opt).from(element).outputPdf('blob');

      const fileName = 'slip-gaji.pdf';
      const downloadPath = this.file.externalRootDirectory + 'Download/';

      await this.file.writeFile(downloadPath, fileName, pdfBlob, { replace: true });

      await this.fileOpener.open(downloadPath + fileName, 'application/pdf');
      this.showToast('PDF berhasil disimpan ke folder Download');
    } catch (err) {
      console.error('PDF Error:', err);
      this.showToast('Gagal membuat atau membuka file PDF.');
    } finally {
      this.slipVisible = false;
    }
  }

  async generatePdfBlob(): Promise<Blob | null> {
    this.slipVisible = true;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const element = document.getElementById('slipGaji');
        if (!element) {
          reject('Element not found');
          return;
        }

        const opt = {
          margin: 0.5,
          filename: 'slip-gaji.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).outputPdf('blob').then((pdfBlob: Blob) => {
          this.slipVisible = false;
          resolve(pdfBlob);
        }).catch((err: any) => {
            this.slipVisible = false;
            reject(err);
          });
      }, 300); // Tunggu 300ms supaya DOM siap
    });
  }

  async downloadPDF() {
    this.slipVisible = true;
    await new Promise((resolve) => setTimeout(resolve, 500)); // beri waktu render

    const blob = await this.generatePdfBlob();
    const fileName = 'slip-gaji.pdf';
    this.slipVisible = false;

    if (!blob) {
      this.showToast('Gagal membuat file PDF.');
      return;
    }

    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      try {
        const path = this.file.externalDataDirectory || this.file.dataDirectory;
        const savedFile = await this.file.writeFile(path, fileName, blob, { replace: true });

        if (savedFile && (savedFile as any).nativeURL) {
          this.fileOpener.open((savedFile as any).nativeURL, 'application/pdf');
        } else {
          this.showToast('File berhasil disimpan tapi tidak dapat dibuka otomatis.');
        }
      } catch (error) {
        console.error('Gagal menyimpan/buka file:', error);
        this.showToast('Terjadi kesalahan saat menyimpan file.');
      }
    } else {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      color: 'danger',
      position: 'bottom'
    });
    toast.present();
  }

  goTo(route: string) {
    switch (route) {
      case 'beranda':
        this.router.navigate(['/dashboard']);
        break;
      case 'presensi':
        this.router.navigate(['/presensi']);
        break;
      case 'akun':
        this.router.navigate(['/akun']);
        break;
      default:
        console.warn('Rute tidak dikenali:', route);
    }
  }

  goBack() {
    this.location.back();
  }
}
