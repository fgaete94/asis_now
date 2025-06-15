import { TestBed } from '@angular/core/testing';
import { ReportesService } from './reportes.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ReportesService', () => {
  let service: ReportesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportesService]
    });
    service = TestBed.inject(ReportesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería enviar un reporte correctamente', () => {
    const reporte = { usuario: 'felipe', estacion: 'TOESCA', descripcion: 'prueba' };
    service.enviarReporte(reporte).subscribe(resp => {
      expect(resp).toEqual({ message: 'Reporte recibido' });
    });

    const req = httpMock.expectOne('http://localhost:5000/api/reportes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reporte);
    req.flush({ message: 'Reporte recibido' });
  });
});
