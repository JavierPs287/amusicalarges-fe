import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Apuntate } from './apuntate';

describe('Apuntate', () => {
  let component: Apuntate;
  let fixture: ComponentFixture<Apuntate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Apuntate],
    }).compileComponents();

    fixture = TestBed.createComponent(Apuntate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
