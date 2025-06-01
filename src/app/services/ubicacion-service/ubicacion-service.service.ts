import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private apiUrl = 'http://localhost:5000/api/ubicacion';

  constructor(private http: HttpClient) {}

  enviarUbicacion(lat: number, lng: number): Observable<{ lat: number, lng: number }> {
    return this.http.post<{ lat: number, lng: number }>(this.apiUrl, { lat, lng });
  }
}
