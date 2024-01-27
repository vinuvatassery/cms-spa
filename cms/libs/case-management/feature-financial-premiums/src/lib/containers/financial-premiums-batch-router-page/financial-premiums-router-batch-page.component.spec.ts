import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsBatchRouterPageComponent } from './financial-premiums-router-batch-page.component';

describe('FinancialPremiumsBatchRouterPageComponent', () => {
  let component: FinancialPremiumsBatchRouterPageComponent;
  let fixture: ComponentFixture<FinancialPremiumsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
