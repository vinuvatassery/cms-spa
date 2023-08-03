import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInsuranceProviderComponent } from './financial-insurance-provider.component';

describe('FinancialInsuranceProviderComponent', () => {
  let component: FinancialInsuranceProviderComponent;
  let fixture: ComponentFixture<FinancialInsuranceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialInsuranceProviderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInsuranceProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
