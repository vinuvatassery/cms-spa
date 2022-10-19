import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EidLifetimePeriodDetailComponent } from './eid-lifetime-period-detail.component';

describe('EidLifetimePeriodDetailComponent', () => {
  let component: EidLifetimePeriodDetailComponent;
  let fixture: ComponentFixture<EidLifetimePeriodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EidLifetimePeriodDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EidLifetimePeriodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
