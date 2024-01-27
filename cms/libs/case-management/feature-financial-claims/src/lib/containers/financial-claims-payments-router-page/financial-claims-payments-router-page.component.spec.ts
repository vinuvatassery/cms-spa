import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsPaymentsRouterPageComponent } from './financial-claims-payments-router-page.component';

describe('FinancialClaimsPaymentsRouterPageComponent', () => {
  let component: FinancialClaimsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<FinancialClaimsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
