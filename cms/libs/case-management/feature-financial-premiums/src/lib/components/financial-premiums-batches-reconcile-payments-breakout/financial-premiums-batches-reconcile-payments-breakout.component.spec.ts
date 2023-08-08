import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent } from './financial-premiums-batches-reconcile-payments-breakout.component';

describe('FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPremiumsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
