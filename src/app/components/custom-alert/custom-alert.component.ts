import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

// Interface untuk konfigurasi tombol
export interface AlertButton {
  text: string;
  role?: 'cancel' | 'confirm';
}

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.scss'],
  standalone: false
})
export class CustomAlertComponent {

  @Input() icon: string = 'information-circle-outline';
  @Input() headerText: string = 'Header';
  @Input() messageText: string = 'Message';
  @Input() alertType: 'success' | 'danger' | 'warning' | 'primary' = 'primary';
  
  // Tombol akan dikirim dari halaman yang memanggilnya
  @Input() cancelButton: AlertButton | null = null;
  @Input() confirmButton: AlertButton | null = null;

  constructor(private modalCtrl: ModalController) {}

  dismiss(role: 'confirm' | 'cancel') {
    this.modalCtrl.dismiss({
      role: role
    });
  }
}
