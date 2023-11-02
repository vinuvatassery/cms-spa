import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalInvoiceComponent } from './approval-invoice.component';

describe('ApprovalInvoiceComponent', () => {
  let component: ApprovalInvoiceComponent;
  let fixture: ComponentFixture<ApprovalInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApprovalInvoiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
