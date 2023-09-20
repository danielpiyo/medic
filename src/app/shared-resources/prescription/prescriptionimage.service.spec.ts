import { TestBed } from '@angular/core/testing';

import { PrescriptionimageService } from './prescriptionimage.service';

describe('PrescriptionimageService', () => {
  let service: PrescriptionimageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriptionimageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
