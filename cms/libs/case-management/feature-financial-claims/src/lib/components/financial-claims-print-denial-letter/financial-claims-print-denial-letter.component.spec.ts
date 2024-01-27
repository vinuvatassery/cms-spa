import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsPrintDenialLetterComponent } from './financial-claims-print-denial-letter.component';

describe('FinancialClaimsPrintDenialLetterComponent', () => {
  let component: FinancialClaimsPrintDenialLetterComponent;
  let fixture: ComponentFixture<FinancialClaimsPrintDenialLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsPrintDenialLetterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsPrintDenialLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
