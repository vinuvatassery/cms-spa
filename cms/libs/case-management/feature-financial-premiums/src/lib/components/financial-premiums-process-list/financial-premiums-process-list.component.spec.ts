import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPremiumsProcessListComponent } from './financial-premiums-process-list.component';

describe('FinancialPremiumsProcessListComponent', () => {
  let component: FinancialPremiumsProcessListComponent;
  let fixture: ComponentFixture<FinancialPremiumsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPremiumsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
