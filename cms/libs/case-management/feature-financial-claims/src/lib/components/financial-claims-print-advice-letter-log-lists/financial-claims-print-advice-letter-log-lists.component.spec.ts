import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsPrintAdviceLetterLogListsComponent } from './financial-claims-print-advice-letter-log-lists.component';

describe('FinancialClaimsPrintAdviceLetterLogListsComponent', () => {
  let component: FinancialClaimsPrintAdviceLetterLogListsComponent;
  let fixture: ComponentFixture<FinancialClaimsPrintAdviceLetterLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsPrintAdviceLetterLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialClaimsPrintAdviceLetterLogListsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
