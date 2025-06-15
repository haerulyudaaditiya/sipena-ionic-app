import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-presensi',
  templateUrl: './presensi.page.html',
  styleUrls: ['./presensi.page.scss'],
  standalone: false,
})
export class PresensiPage implements OnInit {
  presensiData: any = null;
  activeRoute: string = '';

  constructor(private router: Router, private alertController: AlertController, private location: Location) {
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.activeRoute = (event as NavigationEnd).urlAfterRedirects;
    });
   }

  ngOnInit() {
    defineCustomElements(window);
  }

  async ambilPresensi(jenis: 'masuk' | 'keluar') {
    try {
      // Ambil lokasi
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Ambil foto
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      // Simpan data
      this.presensiData = {
        jenis,
        foto: image.dataUrl,
        waktu: new Date().toLocaleString('id-ID'),
        lokasi: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      };

    } catch (err) {
      console.error('Gagal mengambil presensi:', err);
    }
  }

  async kirimPresensi() {
    if (!this.presensiData) return;

    console.log('Data presensi dikirim:', this.presensiData);

    // Tampilkan alert native-style
    const alert = await this.alertController.create({
      header: 'Sukses',
      message: 'Presensi berhasil dikirim!',
      buttons: ['OK']
    });

    await alert.present();

    this.presensiData = null;
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
