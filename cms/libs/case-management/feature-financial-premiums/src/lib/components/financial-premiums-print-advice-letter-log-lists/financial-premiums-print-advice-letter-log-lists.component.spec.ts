import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsPrintAdviceLetterLogListsComponent } from './financial-premiums-print-advice-letter-log-lists.component';

describe('FinancialPremiumsPrintAdviceLetterLogListsComponent', () => {
  let component: FinancialPremiumsPrintAdviceLetterLogListsComponent;
  let fixture: ComponentFixture<FinancialPremiumsPrintAdviceLetterLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsPrintAdviceLetterLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPremiumsPrintAdviceLetterLogListsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
