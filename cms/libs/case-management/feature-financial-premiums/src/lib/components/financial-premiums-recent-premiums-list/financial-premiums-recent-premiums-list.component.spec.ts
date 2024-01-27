import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsRecentPremiumsListComponent } from './financial-premiums-recent-premiums-list.component';

describe('FinancialPremiumsRecentPremiumsListComponent', () => {
  let component: FinancialPremiumsRecentPremiumsListComponent;
  let fixture: ComponentFixture<FinancialPremiumsRecentPremiumsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsRecentPremiumsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsRecentPremiumsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
