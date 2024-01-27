import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsProviderInfoComponent } from './financial-premiums-provider-info.component';

describe('FinancialPremiumsProviderInfoComponent', () => {
  let component: FinancialPremiumsProviderInfoComponent;
  let fixture: ComponentFixture<FinancialPremiumsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
