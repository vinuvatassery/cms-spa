import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumPaymentDetailComponent } from './medical-premium-payment-detail.component';

describe('MedicalPremiumPaymentDetailComponent', () => {
  let component: MedicalPremiumPaymentDetailComponent;
  let fixture: ComponentFixture<MedicalPremiumPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalPremiumPaymentDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
