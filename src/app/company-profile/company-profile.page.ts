import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.page.html',
  styleUrls: ['./company-profile.page.scss'],
  standalone: false,
})
export class CompanyProfilePage implements OnInit {

  constructor(private router: Router, private location: Location) { }

  ngOnInit() {
  }


   goTo(route: string) {
    switch (route) {
      case 'perusahaan':
        this.router.navigate(['/about']);
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
