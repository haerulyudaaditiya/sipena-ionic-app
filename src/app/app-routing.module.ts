import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // 1. Pastikan AuthGuard di-import

const routes: Routes = [
  // DIUBAH: Rute awal kini diarahkan ke 'home' untuk menampilkan splash screen
  {
    path: '',
    redirectTo: 'dashboard', 
    pathMatch: 'full'
  },
  
  // Rute untuk splash screen dan logika awal
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  
  // --- Rute yang tidak dilindungi (Publik) ---
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },

  // --- Rute yang dilindungi (Butuh Login) ---
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard] // 2. Terapkan AuthGuard
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ganti-password',
    loadChildren: () => import('./ganti-password/ganti-password.module').then( m => m.GantiPasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'form-cuti',
    loadChildren: () => import('./form-cuti/form-cuti.module').then( m => m.FormCutiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifikasi',
    loadChildren: () => import('./notifikasi/notifikasi.module').then( m => m.NotifikasiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'presensi',
    loadChildren: () => import('./presensi/presensi.module').then( m => m.PresensiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'riwayat',
    loadChildren: () => import('./riwayat/riwayat.module').then( m => m.RiwayatPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'slip-gaji',
    loadChildren: () => import('./slip-gaji/slip-gaji.module').then( m => m.SlipGajiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'akun',
    loadChildren: () => import('./akun/akun.module').then( m => m.AkunPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-slip-gaji/:id',
    loadChildren: () => import('./pages/detail-slip-gaji/detail-slip-gaji.module').then( m => m.DetailSlipGajiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-absensi/:id',
    loadChildren: () => import('./pages/detail-absensi/detail-absensi.module').then( m => m.DetailAbsensiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detail-cuti/:id',
    loadChildren: () => import('./pages/detail-cuti/detail-cuti.module').then( m => m.DetailCutiPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-guide',
    loadChildren: () => import('./user-guide/user-guide.module').then( m => m.UserGuidePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
