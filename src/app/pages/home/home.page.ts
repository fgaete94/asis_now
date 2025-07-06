import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { Asistencia } from 'src/app/models/asistencia';
import { ToastController, NavController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service'; // Importa el servicio
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { UbicacionService } from 'src/app/services/ubicacion-service/ubicacion-service.service';

// Corrige la ruta de los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/location-pin.png',
  iconUrl: 'assets/leaflet/location-pin.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  estacionesInfo: any[] = [];
  estacion: string = '';

  private map: L.Map | undefined;
  private lat: number | null = null;
  private lng: number | null = null;
  userRol: number = 0;
  rolCargado: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly asistenciaService: AsistenciaService,
    private readonly authService: AuthServiceService,
    private readonly toastController: ToastController,
    private readonly estacionesService: EstacionesServiceService, // Inyecta el servicio
    private readonly ubicacionService: UbicacionService,
    private readonly navCtrl: NavController, // <--- agrega esto
    private readonly cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.obtenerEstacionesInfo();
    this.initMapWithFlask();
    await this.obtenerRolUsuario();
    console.log('Rol actual en home:', this.userRol, typeof this.userRol);
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
    if (!this.estacion) {
      this.mostrarToast('Debes seleccionar una estación');
      return;
    }
    const userData = await this.authService.getDecryptedUserData();
    if (!userData || !userData.user) return;

    // Obtén la ubicación justo antes de enviar
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;
    const osmUrl = lat && lng
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
      : undefined;

    const estacionSeleccionada = this.estacionesInfo.find(est => est.nombre === this.estacion);
    const linea = estacionSeleccionada ? estacionSeleccionada.linea : null;

    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: new Date(),
      salida: null,
      estacion: this.estacion,
      linea: linea,
      ubicacionUrl: osmUrl
    };

    this.asistenciaService.registrarAsistencia(asistencia).subscribe({
      next: () => this.mostrarToast('Entrada registrada'),
      error: (err) => {/* manejar error */}
    });
  }

  async registrarSalida() {
    if (!this.estacion) {
      this.mostrarToast('Debes seleccionar una estación');
      return;
    }
    const userData = await this.authService.getDecryptedUserData();
    if (!userData || !userData.user) {
      return;
    }

    // Obtén la ubicación justo antes de enviar
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;
    const osmUrl = lat && lng
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
      : undefined;

    const estacionSeleccionada = this.estacionesInfo.find(est => est.nombre === this.estacion);
    const linea = estacionSeleccionada ? estacionSeleccionada.linea : null;

    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: null,
      salida: new Date(),
      estacion: this.estacion,
      linea: linea,
      ubicacionUrl: osmUrl
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
        // El backend ya entrega las estaciones filtradas
        this.estacionesInfo = Array.isArray(data) ? data : [];
        console.log('Estaciones cargadas:', this.estacionesInfo);
      },
      error: (err) => {
        this.estacionesInfo = [];
      }
    });
  }

  async initMapWithFlask() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      // Envía la ubicación a Flask y usa la respuesta para centrar el mapa
      this.ubicacionService.enviarUbicacion(lat, lng).subscribe({
        next: (ubicacion: { lat: number, lng: number }) => {
          this.lat = ubicacion.lat;
          this.lng = ubicacion.lng;

          if (!this.map) {
            this.map = L.map('mini-map').setView([this.lat!, this.lng!], 16);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(this.map);

            L.marker([this.lat!, this.lng!]).addTo(this.map)
              .bindPopup('Tu ubicación actual')
              .openPopup();
          } else {
            this.map.setView([this.lat!, this.lng!], 16);
          }
        },
        error: (err: any) => {
          console.error('Error al consultar ubicación en Flask:', err);
        }
      });
    } catch (error) {
      console.error('No se pudo obtener la ubicación del usuario:', error);
    }
  }

  async obtenerRolUsuario() {
    const userData = await this.authService.getDecryptedUserData();
    // userData debe tener la forma { ...User, expiration }
    this.userRol = Number(userData?.rol ?? 0); // <-- NO userData.user.rol
    this.rolCargado = true;
  }

  irACambiarRol() {
    this.navCtrl.navigateForward('/cambiar-rol');
  }

  irAAsistenciaColaboradores() {
    this.navCtrl.navigateForward('/asistencia-colaboradores');
  }

  irAReportes() {
    this.router.navigate(['/reporte-asistencia']);
  }

  irARegistroManual() {
    this.router.navigate(['/registro-manual']);
  }

  irAReporteSupervisor() {
    this.router.navigate(['/reporte-supervisor']);
  }

  irAReporteIncidentes() {
    this.router.navigate(['/reporte-incidentes']);
  }

  async onSalidaClick() {
    if (this.userRol === 2 || this.userRol === 3) {
      this.router.navigate(['/reporte-final-turno']);
    } else {
      await this.registrarSalida();
    }
  }
}
