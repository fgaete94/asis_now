import { TestBed } from '@angular/core/testing';
import { AsistenciaService } from './asistencia.service';
import { ApiConfigService } from '../api-config/api-config.service';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('AsistenciaService', () => {
  let service: AsistenciaService;
  let apiConfigSpy: jasmine.SpyObj<ApiConfigService>;

  beforeEach(() => {
    apiConfigSpy = jasmine.createSpyObj('ApiConfigService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        AsistenciaService,
        { provide: ApiConfigService, useValue: apiConfigSpy }
      ]
    });

    service = TestBed.inject(AsistenciaService);
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería registrar asistencia correctamente', () => {
    const userData = { usuario: 'test' };
    const mockResponse = new HttpResponse({ status: 201, body: { message: 'ok' } });
    apiConfigSpy.post.and.returnValue(of(mockResponse));

    service.registrarAsistencia(userData).subscribe(resp => {
      expect(resp.status).toBe(201);
      expect(resp.body).toEqual({ message: 'ok' });
    });

    expect(apiConfigSpy.post).toHaveBeenCalledWith('Asistencia', userData);
  });
});
