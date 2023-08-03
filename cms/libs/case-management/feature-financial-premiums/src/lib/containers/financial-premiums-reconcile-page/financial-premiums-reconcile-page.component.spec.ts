import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsReconcilePageComponent } from './financial-premiums-reconcile-page.component';

describe('FinancialPremiumsReconcilePageComponent', () => {
  let component: FinancialPremiumsReconcilePageComponent;
  let fixture: ComponentFixture<FinancialPremiumsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
