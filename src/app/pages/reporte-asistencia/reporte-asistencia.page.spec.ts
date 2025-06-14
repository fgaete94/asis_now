import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteAsistenciaPage } from './reporte-asistencia.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReporteAsistenciaPage', () => {
  let component: ReporteAsistenciaPage;
  let fixture: ComponentFixture<ReporteAsistenciaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReporteAsistenciaPage],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debe buscar si la fecha está vacía', () => {
    component.fecha = '';
    component.buscarPorFecha();
    expect(component.cargando).toBeFalse();
  });
});
