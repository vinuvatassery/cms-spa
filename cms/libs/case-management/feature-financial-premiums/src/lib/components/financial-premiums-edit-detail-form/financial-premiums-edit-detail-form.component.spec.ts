import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsEditDetailFormComponent } from './financial-premiums-edit-detail-form.component';

describe('FinancialPremiumsEditDetailFormComponent', () => {
  let component: FinancialPremiumsEditDetailFormComponent;
  let fixture: ComponentFixture<FinancialPremiumsEditDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsEditDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsEditDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
