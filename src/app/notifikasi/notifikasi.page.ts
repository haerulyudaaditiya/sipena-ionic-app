import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notifikasi',
  templateUrl: './notifikasi.page.html',
  styleUrls: ['./notifikasi.page.scss'],
  standalone:false,
})
export class NotifikasiPage implements OnInit {

  notifikasiList = [
    {
      judul: 'Cuti Disetujui',
      tanggal: '2025-05-28T09:30:00',
      isi: 'Pengajuan cuti Anda untuk tanggal 10–12 Juni telah disetujui oleh HRD.'
    },
    {
      judul: 'Absensi Terlambat',
      tanggal: '2025-05-27T08:15:00',
      isi: 'Anda tercatat melakukan absensi terlambat pada 27 Mei 2025.'
    },
    {
      judul: 'Cuti Ditolak',
      tanggal: '2025-05-26T14:00:00',
      isi: 'Pengajuan cuti Anda untuk tanggal 15 Juni telah ditolak. Silakan hubungi HRD.'
    },
    {
      judul: 'Lembur Disetujui',
      tanggal: '2025-05-28T11:00:00',
      isi: 'Pengajuan lembur Anda pada 28 Mei 2025 telah disetujui.'
    }
  ];

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    // Urutkan berdasarkan tanggal terbaru ke terlama
    this.notifikasiList.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
  }

  formatTanggal(tanggal: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(tanggal).toLocaleString('id-ID', options);
  }

  goTo(route: string) {
    switch (route) {
      case 'beranda':
        this.router.navigate(['/dashboard']);
        break;
      default:
        console.warn('Rute tidak dikenali:', route);
    }
  }

  goBack() {
    this.location.back();
  }
}


