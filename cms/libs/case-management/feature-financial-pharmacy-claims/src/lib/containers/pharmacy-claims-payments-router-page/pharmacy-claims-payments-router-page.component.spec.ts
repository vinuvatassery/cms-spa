import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyClaimsPaymentsRouterPageComponent } from './pharmacy-claims-payments-router-page.component';

describe('PharmacyClaimsPaymentsRouterPageComponent', () => {
  let component: PharmacyClaimsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<PharmacyClaimsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyClaimsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacyClaimsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
