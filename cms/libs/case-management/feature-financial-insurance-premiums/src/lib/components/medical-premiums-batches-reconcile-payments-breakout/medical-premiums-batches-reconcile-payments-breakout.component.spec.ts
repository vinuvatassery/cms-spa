import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent } from './medical-premiums-batches-reconcile-payments-breakout.component';

describe('MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
