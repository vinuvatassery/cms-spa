import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DentalClaimsPaymentsRouterPageComponent } from './dental-claims-payments-router-page.component';

describe('DentalClaimsPaymentsRouterPageComponent', () => {
  let component: DentalClaimsPaymentsRouterPageComponent;
  let fixture: ComponentFixture<DentalClaimsPaymentsRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DentalClaimsPaymentsRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DentalClaimsPaymentsRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
