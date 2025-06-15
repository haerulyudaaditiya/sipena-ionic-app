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

      const isAgreed = localStorage.getItem('isAgreed');
      if (isAgreed === 'true') {
        this.router.navigateByUrl('/login');
      } else {
        this.router.navigateByUrl('/welcome');
      }
    }, 5000); // 5 detik
  }
}
