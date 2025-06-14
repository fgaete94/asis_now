import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegEntradaPage } from './reg-entrada.page';

describe('RegEntradaPage', () => {
  let component: RegEntradaPage;
  let fixture: ComponentFixture<RegEntradaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegEntradaPage]
    }).compileComponents();

    fixture = TestBed.createComponent(RegEntradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería ejecutar ngOnInit sin errores', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });
});
