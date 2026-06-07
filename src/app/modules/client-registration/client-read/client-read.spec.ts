import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRead } from './client-read';

describe('ClientRead', () => {
  let component: ClientRead;
  let fixture: ComponentFixture<ClientRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRead],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
