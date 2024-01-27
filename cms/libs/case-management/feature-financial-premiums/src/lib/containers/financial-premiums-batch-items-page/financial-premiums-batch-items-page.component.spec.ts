import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchItemsPageComponent } from './financial-premiums-batch-items-page.component';

describe('FinancialPremiumsBatchItemsPageComponent', () => {
  let component: FinancialPremiumsBatchItemsPageComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
