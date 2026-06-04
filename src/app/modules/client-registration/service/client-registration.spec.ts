import { TestBed } from '@angular/core/testing';

import { ClientRegistration } from './client-registration';

describe('ClientRegistration', () => {
  let service: ClientRegistration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRegistration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
