import { TestBed } from '@angular/core/testing';

import { LincesesService } from './linceses.service';

describe('LincesesService', () => {
  let service: LincesesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LincesesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
