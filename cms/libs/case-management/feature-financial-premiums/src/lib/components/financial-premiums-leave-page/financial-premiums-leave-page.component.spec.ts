import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsLeavePageComponent } from './financial-premiums-leave-page.component';

describe('FinancialPremiumsLeavePageComponent', () => {
  let component: FinancialPremiumsLeavePageComponent;
  let fixture: ComponentFixture<FinancialPremiumsLeavePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsLeavePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsLeavePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
