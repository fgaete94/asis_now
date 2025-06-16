import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes/reportes.service';

@Component({
  selector: 'app-reporte-incidentes',
  templateUrl: './reporte-incidentes.page.html',
  styleUrls: ['./reporte-incidentes.page.scss'],
  standalone: false,
})
export class ReporteIncidentesPage implements OnInit {
  reportes: any[] = [];
  cargando = false;

  constructor(private reportesService: ReportesService) {}

  ngOnInit() {
    this.cargando = true;
    this.reportesService.obtenerReportes().subscribe({
      next: (data) => {
        // Ordena por fecha descendente (más reciente arriba)
        this.reportes = (data || []).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargando = false;
      },
      error: () => {
        this.reportes = [];
        this.cargando = false;
      }
    });
  }
}
