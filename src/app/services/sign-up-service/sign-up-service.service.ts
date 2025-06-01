import { Injectable } from '@angular/core';
import { ApiConfigService } from '../api-config/api-config.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private path = 'usuario'; // <-- Cambia a 'usuario' para usar el endpoint Flask

  constructor(private apiService: ApiConfigService) {}

  registrarUsuario(userData: any): Observable<HttpResponse<any>> {
    // Ahora consulta a tu API Flask, no a Supabase directo
    return this.apiService.post<any>(this.path, userData);
  }
}