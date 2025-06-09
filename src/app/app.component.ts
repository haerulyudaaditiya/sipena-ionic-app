import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';  // Import the App plugin
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private router: Router) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      App.addListener('appUrlOpen', (data: any) => {
        const deepLinkUrl = data.url;  // The deep link URL
        console.log('Deep link URL:', deepLinkUrl);
        
        // Example: Handle your token parameter
        const urlParams = new URLSearchParams(new URL(deepLinkUrl).search);
        const token = urlParams.get('token');
        
        console.log('Token:', token);
        
        // Perform any actions (like navigating to a page or setting data)
        if (token) {
          this.router.navigate(['/activation'], { queryParams: { token: token } });
        }
      });
    });
  }
}