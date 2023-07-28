import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalPremiumsPaymentsRouterPageComponent } from './medical-premiums-payments-router-page.component';

describe('MedicalPremiumsPaymentsRouterPageComponent', () => {
  let component: MedicalPremiumsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<MedicalPremiumsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalPremiumsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalPremiumsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
