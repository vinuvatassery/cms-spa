import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchListDetailItemsComponent } from './financial-claims-batch-list-detail-items.component';

describe('FinancialClaimsBatchListDetailItemsComponent', () => {
  let component: FinancialClaimsBatchListDetailItemsComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchListDetailItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsBatchListDetailItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      FinancialClaimsBatchListDetailItemsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
