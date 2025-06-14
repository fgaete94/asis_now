import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  let currentUrl = '/home';

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    Object.defineProperty(routerSpy, 'url', {
      get: () => currentUrl
    });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('debería identificar home page correctamente', () => {
    currentUrl = '/home';
    expect(component.isHomePage()).toBeTrue();
    currentUrl = '/auth';
    expect(component.isHomePage()).toBeFalse();
    currentUrl = '/sign-up';
    expect(component.isHomePage()).toBeFalse();
    currentUrl = '/otra-pagina';
    expect(component.isHomePage()).toBeTrue();
  });
  

  it('debería limpiar userData y navegar a /auth al hacer logout', async () => {
    // Arrange
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    spyOn(Preferences, 'remove').and.returnValue(Promise.resolve());

    // Act
    await component.logout();

    // Assert
    expect(Preferences.remove).toHaveBeenCalledWith({ key: 'userData' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
