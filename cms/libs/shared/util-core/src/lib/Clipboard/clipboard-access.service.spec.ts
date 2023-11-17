import { TestBed } from '@angular/core/testing';

import { ClipboardAccessService } from './clipboard-access.service';

describe('ClipboardAccessService', () => {
  let service: ClipboardAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
