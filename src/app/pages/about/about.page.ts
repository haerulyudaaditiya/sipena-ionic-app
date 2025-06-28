import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: false
})
export class AboutPage implements OnInit {

  constructor(private location: Location) {}

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

  contactSupport() {
    // Membuka aplikasi email default pengguna
    window.open('mailto:support@sipenacorp.com?subject=Bantuan Aplikasi SIPENA', '_system');
  }
}
