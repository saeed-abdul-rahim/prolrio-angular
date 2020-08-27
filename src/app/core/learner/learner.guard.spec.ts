import { TestBed } from '@angular/core/testing';

import { LearnerGuard } from './learner.guard';

describe('LearnerGuard', () => {
  let guard: LearnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LearnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
