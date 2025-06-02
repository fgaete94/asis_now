import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  baseUrl = environment.API_URL; // Debe ser http://localhost:5000/api

  constructor(private http: HttpClient, private toastCtrl: ToastController) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
      // NO pongas apiKey ni Authorization aquí
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error ocurrido:', error);
    return throwError(() => error);
  }

  get<T>(path: string, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { headers: this.getHeaders(), observe: 'response', params })
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, data: any): Observable<HttpResponse<T>> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, data, { headers: this.getHeaders(), observe: 'response' })
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, data: any, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.http.patch<T>(`${this.baseUrl}/${path}`, data, { headers: this.getHeaders(), observe: 'response', params })
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string, params?: HttpParams): Observable<HttpResponse<T>> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, { headers: this.getHeaders(), observe: 'response', params })
      .pipe(catchError(this.handleError));
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
}