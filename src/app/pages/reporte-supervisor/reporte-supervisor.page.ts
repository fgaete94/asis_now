import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from 'src/app/services/reportes/reportes.service';
import { ToastController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';

@Component({
  selector: 'app-reporte-supervisor',
  templateUrl: './reporte-supervisor.page.html',
  styleUrls: ['./reporte-supervisor.page.scss'],
  standalone: false,
})
export class ReporteSupervisorPage implements OnInit {
  estaciones: any[] = [];
  estacionSeleccionada: string = '';
  descripcion: string = '';
  cargando: boolean = false;

  constructor(
    private estacionesService: EstacionesServiceService,
    private reportesService: ReportesService,
    private toastCtrl: ToastController,
    private router: Router,
    private authService: AuthServiceService
  ) {}

  ngOnInit() {
    this.estacionesService.getBaseUrlInfo().subscribe({
      next: (data) => this.estaciones = data,
      error: () => this.estaciones = []
    });
  }

  async enviarReporte() {
    if (!this.estacionSeleccionada || !this.descripcion.trim()) {
      this.mostrarToast('Debes seleccionar una estación y escribir una descripción.');
      return;
    }
    this.cargando = true;

    // Obtén el usuario logeado de AuthServiceService
    const userData = await this.authService.getDecryptedUserData();
    const usuarioActual = userData?.user || '';

    this.reportesService.enviarReporte({
      usuario: usuarioActual,
      estacion: this.estacionSeleccionada,
      descripcion: this.descripcion
    }).subscribe({
      next: async () => {
        this.cargando = false;
        await this.mostrarToast('Reporte enviado correctamente');
        this.router.navigate(['/home']);
      },
      error: async () => {
        this.cargando = false;
        await this.mostrarToast('Error al enviar el reporte');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      color: 'primary'
    });
    await toast.present();
  }
}
