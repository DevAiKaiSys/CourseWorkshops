import { TestBed } from '@angular/core/testing';

import { FoodSizeService } from './food-size.service';

describe('FoodSizeService', () => {
  let service: FoodSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoodSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
