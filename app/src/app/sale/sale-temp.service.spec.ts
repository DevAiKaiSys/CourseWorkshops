import { TestBed } from '@angular/core/testing';

import { SaleTempService } from './sale-temp.service';

describe('SaleTempService', () => {
  let service: SaleTempService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleTempService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
