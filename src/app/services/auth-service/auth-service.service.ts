import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { User } from 'src/app/models/user';
import { HttpClient, HttpParams, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  // Cambia la URL base a la de tu API Flask
  private readonly apiUrl = 'http://localhost:5000/api'; // <-- Cambia esto si tu Flask está en otro host/puerto

  constructor(private readonly http: HttpClient) {}

  async isDateExpired(): Promise<boolean> {
    const userData = await this.getDecryptedUserData();
    if (userData?.expiration && Date.now() < userData.expiration) {
      console.log('Usuario dentro del tiempo de expiración');
      return true;
    }
    console.log('Usuario fuera del tiempo de expiración');
    await this.logout();
    return false;
  }

  async isAuthenticated(): Promise<boolean> {
    const userData = await this.getDecryptedUserData();
    if (userData && userData.expiration && Date.now() < userData.expiration) {
      return true;
    }
    await this.logout();
    return false;
  }

  async getDecryptedUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
    if (value) {
      try {
        console.log('try');
        const bytes = CryptoJS.AES.decrypt(value, environment.SECRETKEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (e) {
        console.error(e);
        this.logout();
      }
    }
    return null;
  }

  async logout() {
    await Preferences.remove({ key: 'userData' });
  }

  obtener_usuario(username: string): Observable<HttpResponse<User | null>> {
    // Ahora consulta a tu API Flask
    return this.http.get<User | null>(`${this.apiUrl}/usuario/${username}`, { observe: 'response' });
  }

  registrarUsuario(userData: any): Observable<HttpResponse<any>> {
    // Ahora consulta a tu API Flask
    return this.http.post<any>(`${this.apiUrl}/usuario`, userData, { observe: 'response' });
  }

  obtenerTodosUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/usuarios`);
  }
}