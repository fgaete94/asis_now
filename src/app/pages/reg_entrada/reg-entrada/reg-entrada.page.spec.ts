import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegEntradaPage } from './reg-entrada.page';

describe('RegEntradaPage', () => {
  let component: RegEntradaPage;
  let fixture: ComponentFixture<RegEntradaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegEntradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
