import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { Asistencia } from 'src/app/models/asistencia';
import { ToastController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service'; // Importa el servicio

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  estacionesInfo: any[] = [];
  estacion: string = '';

  constructor(
    private readonly router: Router,
    private readonly asistenciaService: AsistenciaService,
    private readonly authService: AuthServiceService,
    private readonly toastController: ToastController,
    private readonly estacionesService: EstacionesServiceService // Inyecta el servicio
  ) {}

  ngOnInit() {
    this.obtenerEstacionesInfo(); // Llama a la función al iniciar el componente
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  async registrarEntrada() {
    const userData = await this.authService.getDecryptedUserData();
    if (!userData || !userData.user) {
      // Manejar usuario no logeado
      return;
    }
    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: new Date(),
      salida: null
    };
    this.asistenciaService.registrarAsistencia(asistencia).subscribe({
      next: () => {
        this.mostrarToast('Entrada registrada');
      },
      error: (err) => {
        // Manejar error
      }
    });
  }

  async registrarSalida() {
    const userData = await this.authService.getDecryptedUserData();
    if (!userData || !userData.user) {
      // Manejar usuario no logeado
      return;
    }
    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: null,
      salida: new Date()
    };
    this.asistenciaService.registrarAsistencia(asistencia).subscribe({
      next: () => {
        this.mostrarToast('Salida registrada');
      },
      error: (err) => {
        // Manejar error
      }
    });
  }

  obtenerEstacionesInfo() {
    this.estacionesService.getBaseUrlInfo().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.features)) {
          // Filtra solo las estaciones con estacion: "EXISTENTE" y línea 2, 3 o 6
          this.estacionesInfo = data.features
            .filter((f: any) =>
              f.attributes.estacion === "EXISTENTE" &&
              (
                f.attributes.linea === "Linea 2" ||
                f.attributes.linea === "Linea 3" ||
                f.attributes.linea === "Linea 6"
              )
            )
            .map((f: any) => ({
              nombre: f.attributes.nombre
            }));
        } else {
          this.estacionesInfo = [];
        }
        console.log('Estaciones cargadas:', this.estacionesInfo);
      },
      error: (err) => {
        this.estacionesInfo = [];
      }
    });
  }
}
