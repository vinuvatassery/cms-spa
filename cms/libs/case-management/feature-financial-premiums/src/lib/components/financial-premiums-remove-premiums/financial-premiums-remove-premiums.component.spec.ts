import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsRemovePremiumsComponent } from './financial-premiums-remove-premiums.component';

describe('FinancialPremiumsRemovePremiumsComponent', () => {
  let component: FinancialPremiumsRemovePremiumsComponent;
  let fixture: ComponentFixture<FinancialPremiumsRemovePremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsRemovePremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsRemovePremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
