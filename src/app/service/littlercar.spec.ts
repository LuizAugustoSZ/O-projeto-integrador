import { TestBed } from '@angular/core/testing';

import { littleCar } from './littlercar.service';

describe('littleCar', () => {
  let service: littleCar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(littleCar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
