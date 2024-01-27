import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchListDetailItemsComponent } from './financial-premiums-batch-list-detail-items.component';

describe('FinancialPremiumsBatchListDetailItemsComponent', () => {
  let component: FinancialPremiumsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialPremiumsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
