import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchesReconcilePaymentsComponent } from './dental-premiums-batches-reconcile-payments.component';

describe('DentalPremiumsBatchesReconcilePaymentsComponent', () => {
  let component: DentalPremiumsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalPremiumsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
