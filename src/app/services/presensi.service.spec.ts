import { TestBed } from '@angular/core/testing';

import { PresensiService } from './presensi.service';

describe('PresensiService', () => {
  let service: PresensiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresensiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
