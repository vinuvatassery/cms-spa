import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsPrintDenialLetterComponent } from './financial-premiums-print-denial-letter.component';

describe('FinancialPremiumsPrintDenialLetterComponent', () => {
  let component: FinancialPremiumsPrintDenialLetterComponent;
  let fixture: ComponentFixture<FinancialPremiumsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
