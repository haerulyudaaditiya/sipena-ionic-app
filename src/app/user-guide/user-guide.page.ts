import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// DITAMBAHKAN: Interface untuk struktur data panduan
interface GuideItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
}

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.page.html',
  styleUrls: ['./user-guide.page.scss'],
  standalone: false
})
export class UserGuidePage implements OnInit {

  // Data untuk panduan disimpan di sini agar mudah dikelola
  guideItems: GuideItem[] = [
    {
      id: 'presensi',
      question: 'Bagaimana cara melakukan presensi?',
      // DIUBAH: Menggunakan tag <strong> untuk teks tebal
      answer: 'Buka menu <strong>Presensi</strong> dari dasbor. Pilih <strong>"Presensi Masuk"</strong> saat tiba di kantor atau <strong>"Presensi Keluar"</strong> saat akan pulang. Aplikasi akan meminta akses lokasi dan kamera untuk validasi. Ambil foto selfie, lalu tekan "Kirim Presensi".',
      icon: 'finger-print-outline'
    },
    {
      id: 'cuti',
      question: 'Bagaimana cara mengajukan cuti?',
      // DIUBAH: Menggunakan tag <strong> untuk teks tebal
      answer: 'Buka menu <strong>Ajukan Cuti</strong> dari dasbor. Isi semua kolom yang diperlukan, termasuk jenis cuti, rentang tanggal, dan alasan. Setelah itu, tekan tombol "Ajukan Cuti". Anda akan menerima notifikasi saat pengajuan Anda divalidasi oleh admin.',
      icon: 'document-text-outline'
    },
    {
      id: 'gaji',
      question: 'Bagaimana cara melihat slip gaji?',
      // DIUBAH: Menggunakan tag <strong> untuk teks tebal
      answer: 'Buka menu <strong>Slip Gaji</strong>. Halaman ini akan menampilkan daftar semua periode gaji yang telah diterbitkan. Ketuk salah satu periode untuk melihat rinciannya. Di halaman detail, Anda juga bisa menekan tombol <strong>"Download PDF"</strong> untuk menyimpannya.',
      icon: 'wallet-outline'
    },
    {
      id: 'riwayat',
      question: 'Di mana saya bisa melihat semua aktivitas saya?',
      // DIUBAH: Menggunakan tag <strong> untuk teks tebal
      answer: 'Semua aktivitas Anda, seperti riwayat presensi dan pengajuan cuti, tercatat di halaman <strong>Riwayat</strong>. Anda bisa menggunakan filter tanggal atau kolom pencarian untuk menemukan aktivitas tertentu.',
      icon: 'bar-chart-outline'
    },
    {
      id: 'profil',
      question: 'Bagaimana cara mengganti password?',
      // DIUBAH: Menggunakan tag <strong> untuk teks tebal
      answer: 'Buka halaman <strong>Akun</strong> melalui ikon di footer. Di sana, pilih opsi <strong>"Ganti Kata Sandi"</strong> untuk masuk ke halaman penggantian password. Anda akan diminta untuk memasukkan password saat ini dan password baru.',
      icon: 'key-outline'
    }
  ];

  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
