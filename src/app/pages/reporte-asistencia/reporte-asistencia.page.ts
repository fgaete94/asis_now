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
  estacionFiltro: string = '';
  asistencias: any[] = [];
  estaciones: string[] = [];
  cargando = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  buscarPorFecha() {
    if (!this.fecha) return;
    this.cargando = true;
    // Extrae solo la fecha (YYYY-MM-DD)
    const fechaSolo = this.fecha.substring(0, 10);
    let url = `http://localhost:5000/api/Asistencia?fecha=${fechaSolo}`;
    if (this.estacionFiltro) {
      url += `&estacion=${encodeURIComponent(this.estacionFiltro)}`;
    }
    this.http.get<any[]>(url)
      .subscribe({
        next: (data) => {
          this.asistencias = data;
          // Actualiza el listado de estaciones únicas para el filtro
          this.estaciones = Array.from(new Set(data.map(a => a.estacion))).sort();
          this.cargando = false;
        },
        error: () => {
          this.asistencias = [];
          this.cargando = false;
        }
      });
  }
}
