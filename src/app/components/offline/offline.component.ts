import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OfflineComponent {
  @Output() retryConnection = new EventEmitter<void>();

  constructor() {}

  onRetry() {
    this.retryConnection.emit();
  }
}
