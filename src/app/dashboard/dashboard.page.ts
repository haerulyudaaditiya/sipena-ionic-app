import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover/profile-popover.component'; 


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {
  user = {
    photo: 'https://i.pravatar.cc/150?img=12'
  };

  showHeader: boolean = true;
  currentTime: string = '';
  currentDate: string = '';
  pengumuman: string | null = null; // 🆕 tambahkan ini

  private lastScrollTop: number = 0;
  private intervalId: any;

  constructor(private router: Router, private popoverCtrl: PopoverController) {}

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateTime() {
    const now = new Date();
    // this.currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    this.currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showHeader = scrollTop <= this.lastScrollTop || scrollTop <= 50;
    this.lastScrollTop = scrollTop;
  }

  async goTo(route: string, event?: any) {
    if (route === 'profile') {
      const popover = await this.popoverCtrl.create({
        component: ProfilePopoverComponent,
        translucent: true,
        cssClass: 'profile-popover',
        event: event, // ✅ tambahkan ini agar muncul di bawah elemen yg diklik
        backdropDismiss: true,
        animated: true
      });
      await popover.present();
      return;
    }

    const routes: { [key: string]: string } = {
      notification: '/notifikasi',
      presensi: '/presensi',
      cuti: '/form-cuti',
      gaji: '/slip-gaji',
      riwayat: '/riwayat',
      perusahaan: '/about',
      beranda: '/dashboard',
      akun: '/akun'
    };
    this.router.navigate([routes[route]]);
  } 
}
