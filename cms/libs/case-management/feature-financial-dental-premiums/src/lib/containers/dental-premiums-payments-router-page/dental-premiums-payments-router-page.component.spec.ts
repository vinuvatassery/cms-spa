import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalPremiumsPaymentsRouterPageComponent } from './dental-premiums-payments-router-page.component';

describe('DentalPremiumsPaymentsRouterPageComponent', () => {
  let component: DentalPremiumsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<DentalPremiumsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalPremiumsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalPremiumsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
