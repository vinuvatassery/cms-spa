import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPaymentDetailComponent } from './dental-payment-detail.component';

describe('DentalPaymentDetailComponent', () => {
  let component: DentalPaymentDetailComponent;
  let fixture: ComponentFixture<DentalPaymentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPaymentDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
