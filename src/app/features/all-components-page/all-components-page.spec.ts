import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllComponentsPage } from './all-components-page';

describe('AllComponentsPage', () => {
  let component: AllComponentsPage;
  let fixture: ComponentFixture<AllComponentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllComponentsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AllComponentsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
