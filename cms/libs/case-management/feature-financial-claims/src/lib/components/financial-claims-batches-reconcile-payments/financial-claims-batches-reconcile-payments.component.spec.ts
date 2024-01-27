import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchesReconcilePaymentsComponent } from './financial-claims-batches-reconcile-payments.component';

describe('FinancialClaimsBatchesReconcilePaymentsComponent', () => {
  let component: FinancialClaimsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialClaimsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
