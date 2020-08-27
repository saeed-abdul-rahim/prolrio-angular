import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitExceededComponent } from './limit-exceeded.component';

describe('LimitExceededComponent', () => {
  let component: LimitExceededComponent;
  let fixture: ComponentFixture<LimitExceededComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitExceededComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitExceededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
