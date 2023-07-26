import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchesReconcilePaymentsBreakoutComponent } from './dental-claims-batches-reconcile-payments-breakout.component';

describe('DentalClaimsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: DentalClaimsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<DentalClaimsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalClaimsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
