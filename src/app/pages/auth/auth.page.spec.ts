import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthPage } from './auth.page';
import { Router } from '@angular/router';

describe('AuthPage navegación y visibilidad', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AuthPage],
      providers: [
        { provide: Router, useValue: routerSpy }
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
});
