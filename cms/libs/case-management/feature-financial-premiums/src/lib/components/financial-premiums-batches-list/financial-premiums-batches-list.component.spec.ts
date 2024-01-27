import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchesListComponent } from './financial-premiums-batches-list.component';

describe('FinancialPremiumsBatchesListComponent', () => {
  let component: FinancialPremiumsBatchesListComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
