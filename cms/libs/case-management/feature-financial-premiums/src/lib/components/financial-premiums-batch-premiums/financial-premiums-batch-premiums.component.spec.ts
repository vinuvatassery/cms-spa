import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchPremiumsComponent } from './financial-premiums-batch-premiums.component';

describe('FinancialPremiumsBatchPremiumsComponent', () => {
  let component: FinancialPremiumsBatchPremiumsComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchPremiumsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsBatchPremiumsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchPremiumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
