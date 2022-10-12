import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPaymentListComponent } from './dental-payment-list.component';

describe('DentalPaymentListComponent', () => {
  let component: DentalPaymentListComponent;
  let fixture: ComponentFixture<DentalPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPaymentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DentalPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
