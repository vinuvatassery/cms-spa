import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalClaimsPaymentsRouterPageComponent } from './medical-claims-payments-router-page.component';

describe('MedicalClaimsPaymentsRouterPageComponent', () => {
  let component: MedicalClaimsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<MedicalClaimsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalClaimsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalClaimsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
