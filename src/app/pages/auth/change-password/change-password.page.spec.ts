import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangePasswordPage } from './change-password.page';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

describe('ChangePasswordPage', () => {
  let component: ChangePasswordPage;
  let fixture: ComponentFixture<ChangePasswordPage>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ChangePasswordPage],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordPage);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Mock ToastController.create to return a toast with present()
    toastControllerSpy.create.and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if password is too short', async () => {
    component.user = 'testuser';
    component.password = '123';
    component.confirmPassword = '123';
    await component.changePassword();
    expect(component.errorMessage).toContain('La contraseña debe contener al menos 6 caracteres.');
  });

  it('should show error if passwords do not match', async () => {
    component.user = 'testuser';
    component.password = '123456';
    component.confirmPassword = '654321';
    await component.changePassword();
    expect(component.errorMessage).toContain('Las contraseñas no coinciden.');
  });

  it('should show error if user is empty', async () => {
    component.user = '';
    component.password = '123456';
    component.confirmPassword = '123456';
    await component.changePassword();
    expect(component.errorMessage).toContain('Debe ingresar el usuario.');
  });

  it('should show error if API fails', fakeAsync(() => {
    component.user = 'testuser';
    component.password = '123456';
    component.confirmPassword = '123456';
    component.errorMessage = '';
    component.changePassword();
    const req = httpMock.expectOne('http://localhost:5000/api/usuario/testuser/password');
    req.flush({}, { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toContain('Error al actualizar la contraseña.');
  }));

  it('should show toast and navigate on success', fakeAsync(async () => {
    component.user = 'testuser';
    component.password = '123456';
    component.confirmPassword = '123456';
    component.errorMessage = '';
    const presentSpy = jasmine.createSpy('present').and.returnValue(Promise.resolve());
    toastControllerSpy.create.and.returnValue(Promise.resolve({ present: presentSpy } as any));
    component.changePassword();
    const req = httpMock.expectOne('http://localhost:5000/api/usuario/testuser/password');
    req.flush({ message: 'Contraseña actualizada correctamente.' });
    tick();
    expect(presentSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/', 'tabs', 'account']);
  }));
});
