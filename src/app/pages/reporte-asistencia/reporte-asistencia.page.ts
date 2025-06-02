import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reporte-asistencia',
  templateUrl: './reporte-asistencia.page.html',
  styleUrls: ['./reporte-asistencia.page.scss'],
  standalone: false,
})
export class ReporteAsistenciaPage implements OnInit {
  fecha: string = '';
  asistencias: any[] = [];
  cargando = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  buscarPorFecha() {
    if (!this.fecha) return;
    this.cargando = true;
    // Extrae solo la fecha (YYYY-MM-DD)
    const fechaSolo = this.fecha.substring(0, 10);
    this.http.get<any[]>(`http://localhost:5000/api/Asistencia?fecha=${fechaSolo}`)
      .subscribe({
        next: (data) => {
          this.asistencias = data;
          this.cargando = false;
        },
        error: () => {
          this.asistencias = [];
          this.cargando = false;
        }
      });
  }
}
