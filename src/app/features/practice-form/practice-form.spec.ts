import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeForm } from './practice-form';

describe('PracticeForm', () => {
  let component: PracticeForm;
  let fixture: ComponentFixture<PracticeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(PracticeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
