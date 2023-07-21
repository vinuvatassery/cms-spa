import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsBatchesReconcilePaymentsBreakoutComponent } from './medical-claims-batches-reconcile-payments-breakout.component';

describe('MedicalClaimsBatchesReconcilePaymentsBreakoutComponent', () => {
  let component: MedicalClaimsBatchesReconcilePaymentsBreakoutComponent;
  let fixture: ComponentFixture<MedicalClaimsBatchesReconcilePaymentsBreakoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsBatchesReconcilePaymentsBreakoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      MedicalClaimsBatchesReconcilePaymentsBreakoutComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
