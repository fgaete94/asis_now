import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { User } from 'src/app/models/user';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage implements OnInit {

  message: string = '';
  user = "";
  password = "";
  errorMessage: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  private sessionDuration = 20 * 60 * 1000;

  username = "";

  userInfo: User | null = null;

  constructor(
    private router: Router,
    private _authService: AuthServiceService,
    private apiService: ApiConfigService,  // Inyecta ApiConfigService aquí
    private httpClient: HttpClient         // Inyecta HttpClient aquí
  ) { }

  ngOnInit() {}

  async obtenerUser(username: string): Promise<User | null> {
    try {
      const params = new HttpParams().set('user', `eq.${username}`);
      const response: HttpResponse<User[]> = await firstValueFrom(
        this.apiService.get<User[]>('Usuario', params)
      );
      
      if (response.body && response.body.length > 0) {
        return response.body[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return null;
    }
  }

  async obtenerUsuario(username: string): Promise<User | null> {
    const response: HttpResponse<User | null> = await firstValueFrom(this._authService.obtener_usuario(username));
    console.log(response);
    return response.body ? response.body : null;
  }

async login(username: string, password: string) {
  try {
    // Solo envía el usuario y contraseña en texto plano al endpoint /api/login
    const response = await this.httpClient.post<User>(
      'http://localhost:5000/api/login',
      { user: username, password }
    ).toPromise();

    if (response) {
      // Login exitoso, guarda datos de usuario, etc.
      this.userInfo = response;

      // Verifica que el rol esté presente antes de cifrar
      console.log("Rol del usuario:", this.userInfo.rol);
      if (!this.userInfo.rol) {
        this.errorMessage = "Error: El rol no está definido en la información del usuario";
        console.error(this.errorMessage);
        return;
      }

      const expiration = Date.now() + this.sessionDuration;
      const userData = { ...this.userInfo, expiration };
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userData), environment.SECRETKEY).toString();

      await Preferences.set({
        key: 'userData',
        value: encryptedData,
      });

      this.router.navigate(['/home']);
    } else {
      this.errorMessage = "Usuario no existente o contraseña incorrecta";
      console.error(this.errorMessage);
    }
  } catch (error) {
    this.errorMessage = "Error al intentar autenticar. Por favor, intente nuevamente.";
    console.error(this.errorMessage, error);
  }
}


  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  async openChangePasswordModal() {
    const username = this.user;
    if (!username) {
      this.errorMessage = "Ingrese su usuario para cambiar la contraseña.";
      return;
    }
    const newPassword = prompt("Ingrese su nueva contraseña:");
    if (!newPassword || newPassword.length < 6) {
      this.errorMessage = "La nueva contraseña debe tener al menos 6 caracteres.";
      return;
    }

    try {
      const response = await this.httpClient.patch(
        'http://localhost:5000/api/usuario/' + encodeURIComponent(username) + '/password',
        { password: newPassword }
      ).toPromise();

      if (response && (response as any).message) {
        this.errorMessage = '';
        alert("Contraseña actualizada correctamente.");
      } else {
        this.errorMessage = "No se pudo actualizar la contraseña.";
      }
    } catch (error) {
      this.errorMessage = "Error al actualizar la contraseña.";
      console.error(error);
    }
  }

}
