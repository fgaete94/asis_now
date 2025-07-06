import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reporte-final-turno',
  templateUrl: './reporte-final-turno.page.html',
  styleUrls: ['./reporte-final-turno.page.scss'],
  standalone: false,
})
export class ReporteFinalTurnoPage implements OnInit {
  asistencias: any[] = [];
  cargando = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.cargando = true;
    this.asistenciaService.obtenerAsistenciasTurnoActual().subscribe({
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

  generarPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Usuario', 'Hora Entrada', 'Hora Salida', 'Estación']],
      body: this.asistencias.map(a => [
        a.usuario,
        a.entrada ? new Date(a.entrada).toLocaleString() : '',
        a.salida ? new Date(a.salida).toLocaleString() : '',
        a.estacion
      ]),
      startY: 20,
    });
    doc.text('Informe de Asistencia - Turno', 14, 10);
    doc.save('informe_turno.pdf');
  }
   cancelar() {
    this.router.navigate(['/home']);
  }
}
