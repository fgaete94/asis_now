import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false
})
export class ChangePasswordPage {
  user: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController
  ) {}

  async changePassword() {
    this.errorMessage = '';

    // Validaciones
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe contener al menos 6 caracteres.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.user) {
      this.errorMessage = 'Debe ingresar el usuario.';
      return;
    }

    try {
      const response: any = await this.http.patch(
        `http://localhost:5000/api/usuario/${encodeURIComponent(this.user)}/password`,
        { password: this.password }
      ).toPromise();

      if (response && response.message) {
        await this.presentToast('Contraseña actualizada correctamente.');
        this.router.navigate(['/auth']);
      } else {
        this.errorMessage = 'No se pudo actualizar la contraseña.';
      }
    } catch (error) {
      this.errorMessage = 'Error al actualizar la contraseña.';
      console.error(error);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }
}
