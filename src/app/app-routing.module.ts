import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'ganti-password',
    loadChildren: () => import('./ganti-password/ganti-password.module').then( m => m.GantiPasswordPageModule)
  },
  {
    path: 'form-cuti',
    loadChildren: () => import('./form-cuti/form-cuti.module').then( m => m.FormCutiPageModule)
  },
  {
    path: 'notifikasi',
    loadChildren: () => import('./notifikasi/notifikasi.module').then( m => m.NotifikasiPageModule)
  },
  {
    path: 'presensi',
    loadChildren: () => import('./presensi/presensi.module').then( m => m.PresensiPageModule)
  },
  {
    path: 'riwayat',
    loadChildren: () => import('./riwayat/riwayat.module').then( m => m.RiwayatPageModule)
  },
  {
    path: 'slip-gaji',
    loadChildren: () => import('./slip-gaji/slip-gaji.module').then( m => m.SlipGajiPageModule)
  },
  {
    path: 'akun',
    loadChildren: () => import('./akun/akun.module').then( m => m.AkunPageModule)
  },
  {
    path: 'company-profile',
    loadChildren: () => import('./company-profile/company-profile.module').then( m => m.CompanyProfilePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
