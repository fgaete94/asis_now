import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private apiUrl = 'http://localhost:5000/api/usuario'; // <-- Debe ser tu API Flask

  constructor(private http: HttpClient) {}

  registrarUsuario(userData: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.apiUrl, userData, { observe: 'response' });
  }
}