import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPage } from './auth.page';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ApiConfigService } from 'src/app/services/api-config/api-config.service';
import { HttpClient } from '@angular/common/http';

describe('AuthPage navegación y visibilidad', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AuthPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthServiceService, useValue: { obtener_usuario: () => {} } },
        { provide: ApiConfigService, useValue: { get: () => {} } },
        { provide: HttpClient, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería navegar a sign-up', () => {
    component.goToSignUp();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-up']);
  });

  it('debería alternar visibilidad de contraseña', () => {
    component.passwordType = 'password';
    component.passwordIcon = 'eye-off';
    component.togglePasswordVisibility();
    expect(component.passwordType).toBe('text');
    expect(component.passwordIcon).toBe('eye');
    component.togglePasswordVisibility();
    expect(component.passwordType).toBe('password');
    expect(component.passwordIcon).toBe('eye-off');
  });

  it('debería inicializar valores por defecto', () => {
    expect(component.message).toBe('');
    expect(component.user).toBe('');
    expect(component.password).toBe('');
    expect(component.errorMessage).toBe('');
    expect(component.passwordType).toBe('password');
    expect(component.passwordIcon).toBe('eye-off');
    expect(component.username).toBe('');
    expect(component.userInfo).toBeNull();
  });

  it('debería cambiar passwordType y passwordIcon correctamente', () => {
    component.passwordType = 'text';
    component.passwordIcon = 'eye';
    component.togglePasswordVisibility();
    expect(component.passwordType).toBe('password');
    expect(component.passwordIcon).toBe('eye-off');
  });
});
