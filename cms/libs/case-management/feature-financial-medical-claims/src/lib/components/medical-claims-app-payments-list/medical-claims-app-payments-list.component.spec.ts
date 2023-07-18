import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsAppPaymentsListComponent } from './medical-claims-app-payments-list.component';

describe('MedicalClaimsAppPaymentsListComponent', () => {
  let component: MedicalClaimsAppPaymentsListComponent;
  let fixture: ComponentFixture<MedicalClaimsAppPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalClaimsAppPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsAppPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
