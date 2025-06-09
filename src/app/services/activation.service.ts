import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Import environment

@Injectable({
  providedIn: 'root'
})
export class ActivationService {

  private apiUrl = environment.apiUrl + '/set-password';  // Menggunakan URL API dari environment

  constructor(private http: HttpClient) {}

  setPassword(token: string, password: string, password_confirmation: string): Observable<any> {
    const body = {
      token: token,
      password: password,
      password_confirmation: password_confirmation
    };

    return this.http.post(this.apiUrl, body);
  }
}