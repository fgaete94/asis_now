import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-rol',
  templateUrl: './cambiar-rol.page.html',
  styleUrls: ['./cambiar-rol.page.scss'],
  standalone: false,
})
export class CambiarRolPage implements OnInit {
  usuarios: any[] = [];
  usuarioSeleccionado: string = '';
  rolSeleccionado: number | null = null;

  roles = [
    { nombre: 'Colaborador', valor: 1 },
    { nombre: 'Supervisor', valor: 2 },
    { nombre: 'Administrador', valor: 3 },
    { nombre: 'Cliente', valor: 4 }
  ];

  constructor(
    private authService: AuthServiceService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.authService.obtenerTodosUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: () => {
        this.usuarios = [];
      }
    });
  }

  async cambiarRol() {
    if (!this.usuarioSeleccionado || !this.rolSeleccionado) return;

    this.authService.cambiarRolUsuario(this.usuarioSeleccionado, this.rolSeleccionado).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Rol actualizado correctamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.navCtrl.back();
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: 'Error al actualizar el rol',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
