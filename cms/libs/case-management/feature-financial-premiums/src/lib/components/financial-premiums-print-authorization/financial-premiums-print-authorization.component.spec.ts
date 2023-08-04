import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsPrintAuthorizationComponent } from './financial-premiums-print-authorization.component';

describe('FinancialPremiumsPrintAuthorizationComponent', () => {
  let component: FinancialPremiumsPrintAuthorizationComponent;
  let fixture: ComponentFixture<FinancialPremiumsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
