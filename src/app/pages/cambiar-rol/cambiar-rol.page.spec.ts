import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarRolPage } from './cambiar-rol.page';

describe('CambiarRolPage', () => {
  let component: CambiarRolPage;
  let fixture: ComponentFixture<CambiarRolPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarRolPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
