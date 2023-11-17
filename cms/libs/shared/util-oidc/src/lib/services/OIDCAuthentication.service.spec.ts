import { TestBed } from '@angular/core/testing';
import { OIDCAuthenticationService } from './OIDCAuthentication.service';

describe('AuthenticationService', () => {
  let service: OIDCAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OIDCAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
