import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { SignUpService } from 'src/app/services/sign-up-service/sign-up-service.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false
})
export class SignUpPage {
  nombre: string = '';
  apellido_paterno: string = '';
  apellido_materno: string = '';
  user: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  errorFields: { [key: string]: string } = {};
  
  constructor(
    private readonly signUpService: SignUpService,
    private readonly router: Router,
    private readonly toastController: ToastController // <-- agrega esto
  ) {}

  async signUp() {
    // Limpiar mensajes de error
    this.errorFields = {};
    this.errorMessage = '';

    // Validaciones
    if (!this.isValidName(this.nombre)) {
      this.errorFields['nombre'] = 'El nombre debe contener al menos 3 letras y no puede incluir números.';
    }
    if (!this.isValidName(this.apellido_paterno)) {
      this.errorFields['apellido'] = 'El apellido debe contener al menos 3 letras y no puede incluir números.';
    }
    if (this.user.length < 3) {
      this.errorFields['user'] = 'El nombre de usuario debe contener al menos 3 letras.';
    }
    if (this.password.length < 6) {
      this.errorFields['password'] = 'La contraseña debe contener al menos 6 caracteres.';
    }
    if (this.password !== this.confirmPassword) {
      this.errorFields['confirmPassword'] = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(this.errorFields).length > 0) {
      return;
    }

    // Encriptar la contraseña antes de enviarla
    const encryptedPassword = CryptoJS.AES.encrypt(this.password, environment.SECRETKEY).toString();

    const newUser = {
      nombre: this.nombre,
      apellido_paterno: this.apellido_paterno,
      apellido_materno: this.apellido_materno,
      user: this.user, // Asignar el nombre de usuario
      password: encryptedPassword,
      rol: 1, // Solo enviamos el ID del rol
    };

    try {
      const response = await firstValueFrom(
        this.signUpService.registrarUsuario(newUser)
      );
      const httpResponse = response as { status: number; body?: any };

      if (httpResponse.status === 201) {
        await this.presentToast('Usuario registrado correctamente');
        this.router.navigate(['/auth']);
      } else {
        this.errorMessage = 'Error al registrar el usuario.';
      }
    } catch (error: unknown) {
      if (this.isHttpError(error) && error.status === 409) {
        this.errorFields['user'] = 'El usuario ya existe. Por favor, intente con otro nombre de usuario.';
      } else {
        this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
      console.error(error);
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top'
    });
    await toast.present();
  }

  // Validaciones
  private isValidName(name: string): boolean {
    return /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(name);
  }

  private isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    return /^[0-9]{9,}$/.test(phone);
  }

  // Type Guard para verificar si el error es un HttpErrorResponse
  private isHttpError(error: unknown): error is HttpErrorResponse {
    return error instanceof HttpErrorResponse;
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }
}