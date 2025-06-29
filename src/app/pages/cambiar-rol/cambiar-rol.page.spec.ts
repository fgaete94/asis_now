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
  let toastSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthServiceService', ['obtenerTodosUsuarios', 'cambiarRolUsuario']);
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    navCtrlSpy = jasmine.createSpyObj('NavController', ['back']);
    toastSpy = jasmine.createSpyObj('HTMLIonToastElement', ['present']);

    toastControllerSpy.create.and.returnValue(Promise.resolve(toastSpy));

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
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

    it('debería cargar usuarios correctamente', fakeAsync(() => {
    const usuariosMock = [
      {
        id: 1,
        user: 'a',
        nombre: 'NombreA',
        apellido_paterno: 'ApellidoA',
        apellido_materno: 'ApellidoA2',
        correo: 'a@email.com', // Puedes quitar esta línea si no está en el modelo
        rol: 1,
        password: '123'
      },
      {
        id: 2,
        user: 'b',
        nombre: 'NombreB',
        apellido_paterno: 'ApellidoB',
        apellido_materno: 'ApellidoB2',
        correo: 'b@email.com', // Puedes quitar esta línea si no está en el modelo
        rol: 2,
        password: '456'
      }
    ];
    authServiceSpy.obtenerTodosUsuarios.and.returnValue(of(usuariosMock));
    component.cargarUsuarios();
    tick();
    expect(component.usuarios).toEqual(usuariosMock);
  }));

  it('debería manejar error al cargar usuarios', fakeAsync(() => {
    authServiceSpy.obtenerTodosUsuarios.and.returnValue(throwError(() => new Error('error')));
    component.cargarUsuarios();
    tick();
    expect(component.usuarios).toEqual([]);
  }));

  it('no debería cambiar rol si falta usuario o rol', fakeAsync(() => {
    component.usuarioSeleccionado = '';
    component.rolSeleccionado = null;
    component.cambiarRol();
    tick();
    expect(authServiceSpy.cambiarRolUsuario).not.toHaveBeenCalled();
  }));

  it('debería cambiar rol correctamente y mostrar toast de éxito', fakeAsync(() => {
    component.usuarioSeleccionado = 'testuser';
    component.rolSeleccionado = 2;
    authServiceSpy.cambiarRolUsuario.and.returnValue(of({}));

    component.cambiarRol();
    tick();

    expect(authServiceSpy.cambiarRolUsuario).toHaveBeenCalledWith('testuser', 2);
    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Rol actualizado correctamente',
      color: 'success'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
    expect(navCtrlSpy.back).toHaveBeenCalled();
  }));

  it('debería mostrar toast de error si falla el cambio de rol', fakeAsync(() => {
    component.usuarioSeleccionado = 'testuser';
    component.rolSeleccionado = 2;
    authServiceSpy.cambiarRolUsuario.and.returnValue(throwError(() => new Error('error')));

    component.cambiarRol();
    tick();

    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Error al actualizar el rol',
      color: 'danger'
    }));
    expect(toastSpy.present).toHaveBeenCalled();
    expect(navCtrlSpy.back).not.toHaveBeenCalled();
  }));
});
