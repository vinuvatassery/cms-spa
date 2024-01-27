import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchItemsPageComponent } from './financial-claims-batch-items-page.component';

describe('FinancialClaimsBatchItemsPageComponent', () => {
  let component: FinancialClaimsBatchItemsPageComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchItemsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchItemsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
