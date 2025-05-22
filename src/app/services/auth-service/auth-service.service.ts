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
  private readonly path = 'Usuarios'; // Nombre de la tabla en Supabase
  private readonly apiUrl = environment.API_URL; // URL base de la API

  constructor(private readonly http: HttpClient) {} // Inyectamos HttpClient

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
    const params = new HttpParams().set('select', '*');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.API_KEY_SUPABASE,
      'Authorization': `Bearer ${environment.API_KEY_SUPABASE}`,
    });

    return this.http.get<User[]>(`${this.apiUrl}/${this.path}`, { params, observe: 'response', headers }).pipe(
      map((response) => {
        console.log(response);
        const filteredBody = response.body?.find((user) => user.user === username && user.rol != null);
        return new HttpResponse({
          body: filteredBody || null, // Devolvemos el usuario encontrado o null
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
      })
    );
  }

  registrarUsuario(userData: any): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.API_KEY_SUPABASE,
      'Authorization': `Bearer ${environment.API_KEY_SUPABASE}`,
    });

    return this.http.post<any>(`${this.apiUrl}/${this.path}`, userData, {
      observe: 'response',
      headers,
    });
  }
}