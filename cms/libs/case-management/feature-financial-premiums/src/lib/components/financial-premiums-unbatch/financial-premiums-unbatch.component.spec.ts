import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsUnbatchComponent } from './financial-premiums-unbatch.component'

describe('FinancialPremiumsUnbatchComponent', () => {
  let component: FinancialPremiumsUnbatchComponent;
  let fixture: ComponentFixture<FinancialPremiumsUnbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsUnbatchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsUnbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
