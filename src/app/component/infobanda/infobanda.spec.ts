import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Infobanda } from './infobanda';

describe('Infobanda', () => {
  let component: Infobanda;
  let fixture: ComponentFixture<Infobanda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Infobanda],
    }).compileComponents();

    fixture = TestBed.createComponent(Infobanda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
