import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchesReconcilePaymentsBreakoutComponent } from './financial-claims-batches-reconcile-payments-breakout.component';

describe('FinancialClaimsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: FinancialClaimsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialClaimsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
