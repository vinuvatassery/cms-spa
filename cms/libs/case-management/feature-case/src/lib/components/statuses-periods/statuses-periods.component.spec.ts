import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusesPeriodsComponent } from './statuses-periods.component';

describe('StatusesPeriodsComponent', () => {
  let component: StatusesPeriodsComponent;
  let fixture: ComponentFixture<StatusesPeriodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusesPeriodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusesPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
