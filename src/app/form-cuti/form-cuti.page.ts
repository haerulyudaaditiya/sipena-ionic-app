// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AlertController } from '@ionic/angular';
// import { Location } from '@angular/common';

// @Component({
//   selector: 'app-form-cuti',
//   templateUrl: './form-cuti.page.html',
//   styleUrls: ['./form-cuti.page.scss'],
//   standalone: false,
// })
// export class FormCutiPage implements OnInit {
//   jenisCuti: string = '';
//   startTime: string = '';
//   endTime: string = '';
//   alasan: string = '';
//   kontakCuti: string = '';

//   showStartTimePicker = false;
//   showEndTimePicker = false;

//   tempStartTime: string = '';
//   tempEndTime: string = '';

//   constructor(private router: Router, private alertController: AlertController, private location: Location) {}

//   ngOnInit() {}

//   onTempStartTimeChange(event: any) {
//     console.log('Start time selected:', event.detail.value);
//     this.tempStartTime = event.detail.value;
//   }

//   onTempEndTimeChange(event: any) {
//     console.log('End time selected:', event.detail.value);
//     this.tempEndTime = event.detail.value;
//   }

//   confirmStartTime() {
//     if (this.tempStartTime && typeof this.tempStartTime === 'string') {
//       try {
//         const isoDate = new Date(this.tempStartTime);
//         if (!isNaN(isoDate.getTime())) {
//           this.startTime = this.formatDateTime(isoDate);
//         } else {
//           console.warn('Tanggal mulai tidak valid:', this.tempStartTime);
//           this.startTime = '';
//         }
//       } catch (error) {
//         console.error('Error parsing start time:', error);
//         this.startTime = '';
//       }
//     }
//     this.showStartTimePicker = false;
//   }

//   confirmEndTime() {
//     if (this.tempEndTime && typeof this.tempEndTime === 'string') {
//       try {
//         const isoDate = new Date(this.tempEndTime);
//         if (!isNaN(isoDate.getTime())) {
//           this.endTime = this.formatDateTime(isoDate);
//         } else {
//           console.warn('Tanggal selesai tidak valid:', this.tempEndTime);
//           this.endTime = '';
//         }
//       } catch (error) {
//         console.error('Error parsing end time:', error);
//         this.endTime = '';
//       }
//     }
//     this.showEndTimePicker = false;
//   }

//   formatDateTime(date: Date): string {
//     const options: Intl.DateTimeFormatOptions = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//     };
//     return date.toLocaleString('id-ID', options); // Contoh: "4 Juni 2025 22.15"
//   }


//   pad(num: number): string {
//     return num < 10 ? '0' + num : num.toString();
//   }

//   getFormattedDate(date: Date): string {
//     if (!date || isNaN(date.getTime())) return 'Format tanggal tidak valid';

//     const options: Intl.DateTimeFormatOptions = {
//       weekday: undefined,
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//     };

//     return date.toLocaleString('id-ID', options); // hasil: 1 Juni 2025 14.30
//   }

//   async ajukanCuti() {
//     if (this.jenisCuti && this.startTime && this.endTime && this.alasan) {
//       const dataCuti = {
//         jenisCuti: this.jenisCuti,
//         startTime: this.startTime,
//         endTime: this.endTime,
//         alasan: this.alasan,
//         kontakCuti: this.kontakCuti,
//       };
//       console.log('Data Cuti Diajukan:', dataCuti);

//       const alert = await this.alertController.create({
//         header: 'Sukses',
//         message: 'Cuti berhasil diajukan!',
//         buttons: ['OK'],
//       });
//       await alert.present();
//     } else {
//       const alert = await this.alertController.create({
//         header: 'Gagal',
//         message: 'Mohon lengkapi semua data cuti.',
//         buttons: ['OK'],
//       });
//       await alert.present();
//     }
//   }

//   goTo(route: string) {
//     switch (route) {
//       case 'perusahaan':
//         this.router.navigate(['/about']);
//         break;
//       case 'beranda':
//         this.router.navigate(['/dashboard']);
//         break;
//       case 'akun':
//         this.router.navigate(['/akun']);
//         break;
//       default:
//         console.warn('Rute tidak dikenali:', route);
//     }
//   }

//   goBack() {
//     this.location.back();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-cuti',
  templateUrl: './form-cuti.page.html',
  styleUrls: ['./form-cuti.page.scss'],
  standalone: false,
})
export class FormCutiPage implements OnInit {
  jenisCuti: string = '';
  startTime: string = '';
  endTime: string = '';
  alasan: string = '';
  kontakCuti: string = '';

  showStartTimePicker = false;
  showEndTimePicker = false;

  tempStartTime: string = '';
  tempEndTime: string = '';

  constructor(private router: Router, private alertController: AlertController, private location: Location) {}

  ngOnInit() {}

  onTempStartTimeChange(event: any) {
    console.log('Start time selected:', event.detail.value);
    this.tempStartTime = event.detail.value;
  }

  onTempEndTimeChange(event: any) {
    console.log('End time selected:', event.detail.value);
    this.tempEndTime = event.detail.value;
  }

  confirmStartTime() {
    if (this.tempStartTime && typeof this.tempStartTime === 'string') {
      try {
        const isoDate = new Date(this.tempStartTime);
        if (!isNaN(isoDate.getTime())) {
          this.startTime = this.formatDateOnly(isoDate);
        } else {
          console.warn('Tanggal mulai tidak valid:', this.tempStartTime);
          this.startTime = '';
        }
      } catch (error) {
        console.error('Error parsing start time:', error);
        this.startTime = '';
      }
    }
    this.showStartTimePicker = false;
  }

  confirmEndTime() {
    if (this.tempEndTime && typeof this.tempEndTime === 'string') {
      try {
        const isoDate = new Date(this.tempEndTime);
        if (!isNaN(isoDate.getTime())) {
          this.endTime = this.formatDateOnly(isoDate);
        } else {
          console.warn('Tanggal selesai tidak valid:', this.tempEndTime);
          this.endTime = '';
        }
      } catch (error) {
        console.error('Error parsing end time:', error);
        this.endTime = '';
      }
    }
    this.showEndTimePicker = false;
  }

  formatDateOnly(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('id-ID', options); // Contoh: "5 Juni 2025"
  }

  resetForm() {
    this.jenisCuti = '';
    this.startTime = '';
    this.endTime = '';
    this.alasan = '';
    this.kontakCuti = '';
    this.tempStartTime = '';
    this.tempEndTime = '';
  }

  async ajukanCuti() {
    if (this.jenisCuti && this.startTime && this.endTime && this.alasan) {
      const dataCuti = {
        jenisCuti: this.jenisCuti,
        startTime: this.startTime,
        endTime: this.endTime,
        alasan: this.alasan,
        kontakCuti: this.kontakCuti,
      };
      console.log('Data Cuti Diajukan:', dataCuti);

      const alert = await this.alertController.create({
        header: 'Sukses',
        message: 'Cuti berhasil diajukan!',
        buttons: ['OK'],
      });
      await alert.present();
      this.resetForm(); // Kosongkan form setelah sukses
    } else {
      const alert = await this.alertController.create({
        header: 'Gagal',
        message: 'Mohon lengkapi semua data cuti.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  goTo(route: string) {
    switch (route) {
      case 'perusahaan':
        this.router.navigate(['/company-profile']);
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

