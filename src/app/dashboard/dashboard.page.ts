import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController, Platform, PopoverController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfilePopoverComponent } from '../profile-popover/profile-popover/profile-popover.component';
import { AnnouncementService } from '../services/announcement.service';
import { LeaveRequestService } from '../services/leave-request.service';
import { NotificationService } from '../services/notification.service';
import { PresensiService } from '../services/presensi.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit, OnDestroy {
  // DIUBAH: Properti user diperbarui untuk mencakup 'name'
  user = {
    photo: ''
  };

  activeRoute: string = '';
  showHeader: boolean = true;
  currentTime: string = '';
  currentDate: string = '';
  pengumuman: string | null = null;
  private lastScrollTop: number = 0;
  private intervalId: any;
  private durationIntervalId: any; // Interval terpisah untuk durasi
  unreadCount = 0;
  latestAnnouncement: { title: string; content: string } | null = null;
  sisaCuti = 0;
  attendanceStatus: 'belum_check_in' | 'sudah_check_in' = 'belum_check_in';
  checkInTime: string = '';
  workDuration: string = '';

  constructor(
    private router: Router,
    private popoverCtrl: PopoverController,
    private http: HttpClient,
    private alertController: AlertController,
    private platform: Platform,
    private notificationService: NotificationService,
    private announcementService: AnnouncementService,
    private leaveRequestService: LeaveRequestService,
    private presensiService: PresensiService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.activeRoute = event.urlAfterRedirects;
      });
  }

  ngOnInit() {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    // Logika load dipindahkan ke ionViewWillEnter
  }

  ngOnDestroy() {
    // Hapus semua interval saat halaman dihancurkan
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.durationIntervalId) clearInterval(this.durationIntervalId);
  }

  // DIUBAH: Menggunakan ionViewWillEnter untuk me-refresh semua data
  ionViewWillEnter() {
    this.loadEmployeePhoto(); // Memuat nama dan foto
    this.fetchUnreadCount();
    this.fetchLatestAnnouncement();
    this.fetchLeaveSummary();
    this.verifyAttendanceState(); // Panggil fungsi untuk status presensi
  }

  // DITAMBAHKAN: Fungsi untuk status presensi
  async verifyAttendanceState() {
    try {
      const response = await firstValueFrom(
        this.presensiService.checkCurrentStatus()
      );
      const attendanceData = response.data;

      if (attendanceData && attendanceData.id) {
        // Jika server mengembalikan data, berarti pengguna BENAR sudah check-in
        this.attendanceStatus = 'sudah_check_in';
        this.checkInTime = new Date(attendanceData.check_in).toLocaleTimeString(
          'id-ID',
          { hour: '2-digit', minute: '2-digit' }
        );
        // Simpan data yang sudah terverifikasi ke localStorage untuk konsistensi
        const verifiedData = {
          id: attendanceData.id,
          date: attendanceData.check_in,
        };
        localStorage.setItem('currentAttendance', JSON.stringify(verifiedData));
      } else {
        // Jika server mengembalikan null, berarti pengguna BELUM check-in
        this.attendanceStatus = 'belum_check_in';
        // Bersihkan data lokal yang mungkin usang
        localStorage.removeItem('currentAttendance');
      }
    } catch (error) {
      console.error('Gagal verifikasi status presensi:', error);
      this.attendanceStatus = 'belum_check_in';
    }
  }

  updateWorkDuration(checkInTime: string) {
    const start = new Date(checkInTime).getTime();
    const now = new Date().getTime();
    let diff = Math.abs(now - start) / 1000;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    this.workDuration = `${hours}j ${minutes}m`;
  }
  // AKHIR BLOK PENAMBAHAN

  // --- Fungsi yang sudah ada (Tidak diubah) ---
  async fetchLeaveSummary() {
    try {
      const response = await firstValueFrom(
        this.leaveRequestService.getLeaveSummary()
      );
      this.sisaCuti = response.remaining_leave || 0;
    } catch (error) {
      console.error('Gagal memuat sisa cuti:', error);
      this.sisaCuti = 0;
    }
  }

  async fetchUnreadCount() {
    try {
      const response = await firstValueFrom(
        this.notificationService.getUnreadCount()
      );
      this.unreadCount = response.unread_count || 0;
    } catch (error) {
      console.error('Gagal mengambil jumlah notifikasi', error);
    }
  }

  async fetchLatestAnnouncement() {
    try {
      const response = await firstValueFrom(
        this.announcementService.getLatestAnnouncement()
      );
      this.latestAnnouncement = response.data;
    } catch (error) {
      console.error('Gagal memuat pengumuman:', error);
    }
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.currentDate = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    this.showHeader = scrollTop <= this.lastScrollTop || scrollTop <= 50;
    this.lastScrollTop = scrollTop;
  }

  // DIUBAH: Logika loadEmployeePhoto disederhanakan menjadi loadUserData
   loadEmployeePhoto() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const employeeId = user.employee_id;

      const apiUrl = `${environment.apiUrl}/employees/${employeeId}`;
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get<any>(apiUrl, { headers }).subscribe(
        (data) => {
          this.user.photo = data.employee.photo || '';
        },
        (error) => {
          console.error('Error fetching employee photo:', error);
        }
      );
    } else {
      console.error('User data not found in localStorage.');
    }
  }

  getImageUrl(photoPath: string): string {
    const defaultPhotoUrl = 'https://archive.org/download/instagram-plain-round/instagram%20dip%20in%20hair.jpg';
    if (!photoPath) {
      return defaultPhotoUrl;
    }
    return `${environment.imageBaseUrl}/${photoPath}`;
  }

  async goTo(route: string, event?: any) {
    if (route === 'profile') {
      const popover = await this.popoverCtrl.create({
        component: ProfilePopoverComponent,
        translucent: true,
        cssClass: 'profile-popover',
        event: event,
        backdropDismiss: true,
        animated: true,
      });
      await popover.present();
      return;
    }
    const routes: { [key: string]: string } = {
      notifikasi: '/notifikasi',
      presensi: '/presensi',
      cuti: '/form-cuti',
      gaji: '/slip-gaji',
      riwayat: '/riwayat',
      beranda: '/dashboard',
      akun: '/akun',
    };
    if (routes[route]) {
      this.router.navigate([routes[route]]);
    }
  }
}
