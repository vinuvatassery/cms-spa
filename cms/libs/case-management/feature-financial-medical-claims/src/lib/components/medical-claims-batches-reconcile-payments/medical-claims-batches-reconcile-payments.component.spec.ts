import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchesReconcilePaymentsComponent } from './medical-claims-batches-reconcile-payments.component';

describe('MedicalClaimsBatchesReconcilePaymentsComponent', () => {
  let component: MedicalClaimsBatchesReconcilePaymentsComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchesReconcilePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchesReconcilePaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalClaimsBatchesReconcilePaymentsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
