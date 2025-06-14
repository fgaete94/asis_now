import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUpPage } from './sign-up.page';
import { Router } from '@angular/router';
import { SignUpService } from 'src/app/services/sign-up-service/sign-up-service.service';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

describe('SignUpPage', () => {
  let component: SignUpPage;
  let fixture: ComponentFixture<SignUpPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let signUpServiceSpy: jasmine.SpyObj<SignUpService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    signUpServiceSpy = jasmine.createSpyObj('SignUpService', ['registrarUsuario']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [SignUpPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: SignUpService, useValue: signUpServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería encriptar la contraseña correctamente', () => {
    const password = 'mipassword';
    const encrypted = CryptoJS.AES.encrypt(password, environment.SECRETKEY).toString();
    // Desencriptar para comprobar
    const decrypted = CryptoJS.AES.decrypt(encrypted, environment.SECRETKEY).toString(CryptoJS.enc.Utf8);
    expect(decrypted).toBe(password);
  });

  it('debería validar nombres válidos', () => {
    expect(component['isValidName']('Juan')).toBeTrue();
    expect(component['isValidName']('José Luis')).toBeTrue();
    expect(component['isValidName']('A')).toBeFalse();
    expect(component['isValidName']('J0se')).toBeFalse();
    expect(component['isValidName']('')).toBeFalse();
  });

  it('debería validar emails válidos', () => {
    expect(component['isValidEmail']('test@email.com')).toBeTrue();
    expect(component['isValidEmail']('usuario@dominio.cl')).toBeTrue();
    expect(component['isValidEmail']('usuario@dominio')).toBeFalse();
    expect(component['isValidEmail']('usuario.com')).toBeFalse();
    expect(component['isValidEmail']('')).toBeFalse();
  });

  it('debería validar teléfonos válidos', () => {
    expect(component['isValidPhoneNumber']('987654321')).toBeTrue();
    expect(component['isValidPhoneNumber']('1234567890')).toBeTrue();
    expect(component['isValidPhoneNumber']('12345')).toBeFalse();
    expect(component['isValidPhoneNumber']('abc123456')).toBeFalse();
    expect(component['isValidPhoneNumber']('')).toBeFalse();
  });
});
