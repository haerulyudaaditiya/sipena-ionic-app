import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Cek apakah ada token di localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
      return true; // Izinkan akses ke halaman
    } else {
      // Jika tidak ada token, paksa arahkan ke halaman login
      this.router.navigate(['/login']);
      return false; // Blokir akses ke halaman
    }
  }
}
