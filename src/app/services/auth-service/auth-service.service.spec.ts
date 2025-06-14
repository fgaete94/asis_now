import { TestBed } from '@angular/core/testing';
import { AuthServiceService } from './auth-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

describe('AuthServiceService', () => {
  let service: AuthServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthServiceService]
    });
    service = TestBed.inject(AuthServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería llamar a obtener_usuario', () => {
    service.obtener_usuario('testuser').subscribe();
    const req = httpMock.expectOne(`${environment.API_URL}/usuario/testuser`);
    expect(req.request.method).toBe('GET');
    req.flush({ user: 'testuser' });
  });

  it('debería llamar a registrarUsuario', () => {
    const userData = { user: 'nuevo' };
    service.registrarUsuario(userData).subscribe();
    const req = httpMock.expectOne(`${environment.API_URL}/usuario`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 201 });
  });

  it('debería llamar a obtenerTodosUsuarios', () => {
    service.obtenerTodosUsuarios().subscribe();
    const req = httpMock.expectOne(`${environment.API_URL}/usuarios`);
    expect(req.request.method).toBe('GET');
    req.flush([{ user: 'a' }, { user: 'b' }]);
  });

  it('debería llamar a cambiarRolUsuario', () => {
    const apiSpy = jasmine.createSpyObj('ApiConfigService', ['patch']);
    const serviceWithSpy = new AuthServiceService(TestBed.inject(HttpClientTestingModule) as any, apiSpy);
    apiSpy.patch.and.returnValue({ subscribe: () => {} });
    serviceWithSpy.cambiarRolUsuario('testuser', 2);
    expect(apiSpy.patch).toHaveBeenCalledWith('usuario/testuser/rol', { rol: 2 });
  });

  

  it('debería retornar null si no hay userData en getDecryptedUserData', async () => {
    spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
    const result = await service.getDecryptedUserData();
    expect(result).toBeNull();
  });



  
});
