import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundAllPaymentListComponent } from './refund-all-payment-list.component';

describe('RefundAllPaymentListComponent', () => {
  let component: RefundAllPaymentListComponent;
  let fixture: ComponentFixture<RefundAllPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RefundAllPaymentListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundAllPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
