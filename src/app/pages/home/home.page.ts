import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia/asistencia.service';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { Asistencia } from 'src/app/models/asistencia';
import { ToastController } from '@ionic/angular';
import { EstacionesServiceService } from 'src/app/services/estaciones/estaciones-service.service'; // Importa el servicio
import * as L from 'leaflet';

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
  private lat: number | null = null; // NUEVO
  private lng: number | null = null; // NUEVO

  constructor(
    private readonly router: Router,
    private readonly asistenciaService: AsistenciaService,
    private readonly authService: AuthServiceService,
    private readonly toastController: ToastController,
    private readonly estacionesService: EstacionesServiceService // Inyecta el servicio
  ) {}

  ngOnInit() {
    this.obtenerEstacionesInfo();
    this.initMapWithLocation();
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
      return;
    }
    const estacionSeleccionada = this.estacionesInfo.find(est => est.nombre === this.estacion);
    const linea = estacionSeleccionada ? estacionSeleccionada.linea : null;

    // Genera la URL compatible con OSM
    const osmUrl = (this.lat && this.lng)
      ? `https://www.openstreetmap.org/?mlat=${this.lat}&mlon=${this.lng}#map=16/${this.lat}/${this.lng}`
      : undefined;

    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: new Date(),
      salida: null,
      estacion: this.estacion,
      linea: linea,
      ubicacionUrl: osmUrl // NUEVO CAMPO
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
      return;
    }
    const estacionSeleccionada = this.estacionesInfo.find(est => est.nombre === this.estacion);
    const linea = estacionSeleccionada ? estacionSeleccionada.linea : null;

    // Genera la URL compatible con OSM
    const osmUrl = (this.lat && this.lng)
      ? `https://www.openstreetmap.org/?mlat=${this.lat}&mlon=${this.lng}#map=16/${this.lat}/${this.lng}`
      : undefined;

    const asistencia: Asistencia = {
      usuario: userData.user,
      entrada: null,
      salida: new Date(),
      estacion: this.estacion,
      linea: linea,
      ubicacionUrl: osmUrl // NUEVO CAMPO
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
              nombre: f.attributes.nombre,
              linea: f.attributes.linea
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

  async initMapWithLocation() {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;   // GUARDAR LAT
        this.lng = position.coords.longitude;  // GUARDAR LNG

        if (!this.map) {
          this.map = L.map('mini-map').setView([this.lat, this.lng], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

          L.marker([this.lat, this.lng]).addTo(this.map)
            .bindPopup('Tu ubicación actual')
            .openPopup();
        }
      },
      (error) => {
        // Manejar error de geolocalización
      }
    );
  }
}
