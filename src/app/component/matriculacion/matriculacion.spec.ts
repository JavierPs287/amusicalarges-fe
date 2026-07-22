import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { Matriculacion } from './matriculacion';

describe('Matriculacion', () => {
  let component: Matriculacion;
  let fixture: ComponentFixture<Matriculacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Matriculacion],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Matriculacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
