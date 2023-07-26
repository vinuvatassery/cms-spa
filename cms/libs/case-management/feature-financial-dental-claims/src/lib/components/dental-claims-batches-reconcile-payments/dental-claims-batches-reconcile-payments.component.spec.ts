import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsBatchesReconcilePaymentsComponent } from './dental-claims-batches-reconcile-payments.component';

describe('DentalClaimsBatchesReconcilePaymentsComponent', () => {
  let component: DentalClaimsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<DentalClaimsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalClaimsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
