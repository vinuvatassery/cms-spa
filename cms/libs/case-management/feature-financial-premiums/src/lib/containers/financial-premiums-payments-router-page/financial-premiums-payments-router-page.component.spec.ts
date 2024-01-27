import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsPaymentsRouterPageComponent } from './financial-premiums-payments-router-page.component';

describe('FinancialPremiumsPaymentsRouterPageComponent', () => {
  let component: FinancialPremiumsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<FinancialPremiumsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
