import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsBatchesReconcilePaymentsComponent } from './pharmacy-claims-batches-reconcile-payments.component';

describe('PharmacyClaimsBatchesReconcilePaymentsComponent', () => {
  let component: PharmacyClaimsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<PharmacyClaimsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      PharmacyClaimsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
