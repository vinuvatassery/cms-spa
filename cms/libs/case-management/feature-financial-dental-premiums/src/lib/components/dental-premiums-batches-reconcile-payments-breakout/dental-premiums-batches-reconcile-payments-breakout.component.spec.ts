import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsBatchesReconcilePaymentsBreakoutComponent } from './dental-premiums-batches-reconcile-payments-breakout.component';

describe('DentalPremiumsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: DentalPremiumsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<DentalPremiumsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      DentalPremiumsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
