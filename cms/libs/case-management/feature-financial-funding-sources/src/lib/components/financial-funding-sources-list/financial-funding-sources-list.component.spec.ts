import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialFundingSourcesListComponent } from './financial-funding-sources-list.component';

describe('FinancialFundingSourcesListComponent', () => {
  let component: FinancialFundingSourcesListComponent;
  let fixture: ComponentFixture<FinancialFundingSourcesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialFundingSourcesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialFundingSourcesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
