import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialPremiumsAllPaymentsListComponent } from './financial-premiums-all-payments-list.component';

describe('FinancialPremiumsAllPaymentsListComponent', () => {
  let component: FinancialPremiumsAllPaymentsListComponent;
  let fixture: ComponentFixture<FinancialPremiumsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPremiumsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPremiumsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
