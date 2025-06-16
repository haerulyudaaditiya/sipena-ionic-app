import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ← ini penting

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  showSplash = true;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;

      const currentUrl = window.location.pathname;
      const isFirstOpen = localStorage.getItem('firstOpen');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      // ❗ Jangan redirect kalau user sedang di halaman forgot/reset password
      if (
        currentUrl === '/forgot-password' ||
        currentUrl === '/reset-password'
      ) {
        return;
      }

      if (!isFirstOpen) {
        localStorage.setItem('firstOpen', 'true');
        this.router.navigateByUrl('/welcome');
      } else if (isLoggedIn === 'true') {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/login');
      }
    }, 2000);
  }
}
