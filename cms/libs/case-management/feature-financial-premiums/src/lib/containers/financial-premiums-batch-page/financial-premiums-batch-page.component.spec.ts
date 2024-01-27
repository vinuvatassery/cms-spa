import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchPageComponent } from './financial-premiums-batch-page.component';

describe('FinancialPremiumsBatchPageComponent', () => {
  let component: FinancialPremiumsBatchPageComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
