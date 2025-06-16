import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:5000/api/reportes';

  constructor(private http: HttpClient) {}

  enviarReporte(reporte: { usuario: string; estacion: string, descripcion: string }): Observable<any> {
    return this.http.post(this.apiUrl, reporte);
  }

  // GET para obtener todos los reportes ordenados por fecha descendente
  obtenerReportes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
