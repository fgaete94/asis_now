import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CambiarRolPage } from './cambiar-rol.page';
import { AuthServiceService } from 'src/app/services/auth-service/auth-service.service';
import { ToastController, NavController } from '@ionic/angular';
import { of, throwError } from 'rxjs';

describe('CambiarRolPage', () => {
  let component: CambiarRolPage;
  let fixture: ComponentFixture<CambiarRolPage>;
  let authServiceSpy: jasmine.SpyObj<AuthServiceService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['obtenerTodosUsuarios', 'cambiarRolUsuario']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['back']);

    await TestBed.configureTestingModule({
      declarations: [CambiarRolPage],
      providers: [
        { provide: AuthServiceService, useValue: authServiceSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: NavController, useValue: navCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CambiarRolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios correctamente', () => {
    const usuarios = [{
      id: 1,
      nombre: 'Test',
      apellido_paterno: 'User',
      apellido_materno: 'Apellido',
      rol: 1,
      user: 'test',
      password: '123456'
    }];
    authServiceSpy.obtenerTodosUsuarios.and.returnValue(of(usuarios));
    component.cargarUsuarios();
    expect(component.usuarios).toEqual(usuarios);
  });

  it('debería manejar error al cargar usuarios', () => {
    authServiceSpy.obtenerTodosUsuarios.and.returnValue(throwError(() => new Error('error')));
    component.cargarUsuarios();
    expect(component.usuarios).toEqual([]);
  });

  it('no debería cambiar rol si falta usuario o rol', () => {
    component.usuarioSeleccionado = '';
    component.rolSeleccionado = null;
    component.cambiarRol();
    expect(authServiceSpy.cambiarRolUsuario).not.toHaveBeenCalled();
  });

  it('debería cambiar rol correctamente y mostrar toast de éxito', fakeAsync(async () => {
    component.usuarioSeleccionado = 'testuser';
    component.rolSeleccionado = 2;
    authServiceSpy.cambiarRolUsuario.and.returnValue(of({}));
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await component.cambiarRol();
    tick();

    expect(authServiceSpy.cambiarRolUsuario).toHaveBeenCalledWith('testuser', 2);
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Rol actualizado correctamente',
      color: 'success'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
    expect(navCtrlSpy.back).toHaveBeenCalled();
  }));

  it('debería mostrar toast de error si falla el cambio de rol', fakeAsync(async () => {
    component.usuarioSeleccionado = 'testuser';
    component.rolSeleccionado = 2;
    authServiceSpy.cambiarRolUsuario.and.returnValue(throwError(() => new Error('error')));
    const toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);
    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

    await component.cambiarRol();
    tick();

    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error al actualizar el rol',
      color: 'danger'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
    expect(navCtrlSpy.back).not.toHaveBeenCalled();
  }));
});
