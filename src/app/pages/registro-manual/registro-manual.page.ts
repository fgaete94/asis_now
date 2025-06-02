import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-manual',
  templateUrl: './registro-manual.page.html',
  styleUrls: ['./registro-manual.page.scss'],
  standalone: false,
})
export class RegistroManualPage implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: string = '';
  observacion: string = '';
  mensaje: string = '';

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/api/usuarios').subscribe(data => {
      this.usuarios = data;
    });
  }

  registrarManual() {
    const now = new Date();
    const asistencia = {
      usuario: this.usuarioSeleccionado,
      justificado: now.toISOString(),
      observacion: this.observacion
    };
    this.http.post('http://localhost:5000/api/Asistencia/manual', asistencia)
      .subscribe({
        next: async () => {
          await this.mostrarToast('Registro manual exitoso');
          this.router.navigate(['/home']);
        },
        error: async () => {
          await this.mostrarToast('Error al registrar');
        }
      });
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, position: 'bottom', color: 'success' });
    await toast.present();
    this.mensaje = '';
  }
}
