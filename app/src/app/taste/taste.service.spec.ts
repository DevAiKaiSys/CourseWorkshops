import { TestBed } from '@angular/core/testing';

import { TasteService } from './taste.service';

describe('TasteService', () => {
  let service: TasteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
