import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchesLogListsComponent } from './financial-premiums-batches-log-lists.component';

describe('FinancialPremiumsBatchesLogListsComponent', () => {
  let component: FinancialPremiumsBatchesLogListsComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
