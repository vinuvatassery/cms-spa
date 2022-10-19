import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EidLifetimePeriodListComponent } from './eid-lifetime-period-list.component';

describe('EidLifetimePeriodListComponent', () => {
  let component: EidLifetimePeriodListComponent;
  let fixture: ComponentFixture<EidLifetimePeriodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EidLifetimePeriodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EidLifetimePeriodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
