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

      // Redirect ke login setelah splash
      this.router.navigateByUrl('/login');
    }, 3000); // delay 2 detik
  }
}
