import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialFundingSourcesRemoveComponent } from './financial-funding-sources-remove.component';

describe('FinancialFundingSourcesRemoveComponent', () => {
  let component: FinancialFundingSourcesRemoveComponent;
  let fixture: ComponentFixture<FinancialFundingSourcesRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialFundingSourcesRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialFundingSourcesRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
