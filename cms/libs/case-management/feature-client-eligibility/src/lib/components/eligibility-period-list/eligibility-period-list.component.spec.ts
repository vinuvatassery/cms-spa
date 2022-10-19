import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityPeriodListComponent } from './eligibility-period-list.component';

describe('EligibilityPeriodListComponent', () => {
  let component: EligibilityPeriodListComponent;
  let fixture: ComponentFixture<EligibilityPeriodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EligibilityPeriodListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityPeriodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
