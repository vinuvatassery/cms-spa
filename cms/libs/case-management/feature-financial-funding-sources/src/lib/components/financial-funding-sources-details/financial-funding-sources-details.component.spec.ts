import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialFundingSourcesDetailsComponent } from './financial-funding-sources-details.component';

describe('FinancialFundingSourcesDetailsComponent', () => {
  let component: FinancialFundingSourcesDetailsComponent;
  let fixture: ComponentFixture<FinancialFundingSourcesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialFundingSourcesDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialFundingSourcesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
