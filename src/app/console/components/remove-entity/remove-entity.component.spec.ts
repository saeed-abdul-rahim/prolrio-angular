import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEntityComponent } from './remove-entity.component';

describe('RemoveEntityComponent', () => {
  let component: RemoveEntityComponent;
  let fixture: ComponentFixture<RemoveEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
