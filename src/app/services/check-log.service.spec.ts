import { TestBed } from '@angular/core/testing';

import { CheckLogService } from './check-log.service';

describe('CheckLogService', () => {
  let service: CheckLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
