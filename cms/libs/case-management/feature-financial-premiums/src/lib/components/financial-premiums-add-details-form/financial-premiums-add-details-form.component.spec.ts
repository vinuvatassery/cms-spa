import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsAddDetailsFormComponent } from './financial-premiums-add-details-form.component';

describe('FinancialPremiumsAddDetailsFormComponent', () => {
  let component: FinancialPremiumsAddDetailsFormComponent;
  let fixture: ComponentFixture<FinancialPremiumsAddDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsAddDetailsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsAddDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
