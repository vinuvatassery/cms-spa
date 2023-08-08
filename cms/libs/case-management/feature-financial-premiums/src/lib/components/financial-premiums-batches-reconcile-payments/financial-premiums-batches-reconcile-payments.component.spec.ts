import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsBatchesReconcilePaymentsComponent } from './medical-premiums-batches-reconcile-payments.component';

describe('MedicalPremiumsBatchesReconcilePaymentsComponent', () => {
  let component: MedicalPremiumsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<MedicalPremiumsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalPremiumsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
