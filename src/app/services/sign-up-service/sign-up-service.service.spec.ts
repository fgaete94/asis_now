import { TestBed } from '@angular/core/testing';
import { SignUpService } from './sign-up-service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignUpService]
    });
    service = TestBed.inject(SignUpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar un usuario correctamente', () => {
    const userData = { user: 'nuevo', password: '1234' };
    service.registrarUsuario(userData).subscribe(resp => {
      expect(resp.status).toBe(201);
      expect(resp.body).toEqual({ message: 'Usuario creado' });
    });

    const req = httpMock.expectOne('http://localhost:5000/api/usuario');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush({ message: 'Usuario creado' }, { status: 201, statusText: 'Created' });
  });
});
