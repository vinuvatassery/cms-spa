import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPaymentListComponent } from './medical-payment-list.component';

describe('MedicalPaymentListComponent', () => {
  let component: MedicalPaymentListComponent;
  let fixture: ComponentFixture<MedicalPaymentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPaymentListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
