import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent } from './pharmacy-claims-batches-reconcile-payments-breakout.component';

describe('PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
