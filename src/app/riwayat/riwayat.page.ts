import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss'],
  standalone: false,
})
export class RiwayatPage implements OnInit {
  selectedMonth: string = new Date().getMonth().toString(); // default bulan sekarang
  selectedYear: number = new Date().getFullYear();
  months = [
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' },
  ];
  years: number[] = [];

  allData: any[] = []; // Data mentah semua
  riwayatGabungan: any[] = [];

  searchTerm: string = '';
  filteredRiwayat: any[] = [];

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    // 5 tahun kedepan
    for (let y = currentYear; y <= currentYear + 4; y++) {
      this.years.push(y);
    }
    // 5 tahun terakhir
    // for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    //   this.years.push(y);
    // }
    // kombnasi 2 tahun terakhir dan kedepan
    // for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    //   this.years.push(y);
    // }

    // Dummy data gabungan
    this.allData = [
      { jenis: 'absensi', tanggal: '2025-06-04', status: 'Masuk' },
      { jenis: 'pengajuan', tanggal: '2025-06-12', startDate: '2025-06-12', endDate: '2025-06-14', status: 'Disetujui', keterangan: 'Cuti Tahunan' },
      { jenis: 'absensi', tanggal: '2025-04-15', status: 'Cuti' },
      { jenis: 'pengajuan', tanggal: '2025-04-01', startDate: '2025-04-01', endDate: '2025-04-02', status: 'Ditolak', keterangan: 'Cuti Sakit' },
      { jenis: 'absensi', tanggal: '2025-05-29', status: 'Masuk' },
      { jenis: 'pengajuan', tanggal: '2025-05-30', startDate: '2025-05-30', endDate: '2025-06-03', status: 'Disetujui', keterangan: 'Cuti Izin' },
    ];

    this.filterRiwayat();
  }

  filterRiwayat() {
    const filtered = this.allData.filter(item => {
      const date = new Date(item.tanggal);
      return (
        date.getMonth().toString() === this.selectedMonth &&
        date.getFullYear() === this.selectedYear
      );
    });

    this.riwayatGabungan = filtered.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    this.applySearch(); // Apply search after filter
  }

  applySearch() {
    const term = this.searchTerm.toLowerCase();

    this.filteredRiwayat = this.riwayatGabungan.filter(item => {
      const tanggal = new Date(item.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
      });

      const text = `${item.status || ''} ${item.keterangan || ''} ${tanggal}`.toLowerCase();

      return text.includes(term);
    });
  }

  goTo(route: string) {
    switch (route) {
      case 'perusahaan':
        this.router.navigate(['/about']);
        break;
      case 'beranda':
        this.router.navigate(['/dashboard']);
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
