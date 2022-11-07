import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPaymentDetailComponent } from './medical-payment-detail.component';

describe('MedicalPaymentDetailComponent', () => {
  let component: MedicalPaymentDetailComponent;
  let fixture: ComponentFixture<MedicalPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPaymentDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
