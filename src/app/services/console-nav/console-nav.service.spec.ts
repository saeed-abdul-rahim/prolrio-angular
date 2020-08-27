import { TestBed } from '@angular/core/testing';

import { ConsoleNavService } from './console-nav.service';

describe('ConsoleNavService', () => {
  let service: ConsoleNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsoleNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
