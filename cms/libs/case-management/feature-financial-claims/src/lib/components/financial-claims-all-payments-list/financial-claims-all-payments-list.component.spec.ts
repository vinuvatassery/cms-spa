import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialClaimsAllPaymentsListComponent } from './financial-claims-all-payments-list.component';

describe('FinancialClaimsAllPaymentsListComponent', () => {
  let component: FinancialClaimsAllPaymentsListComponent;
  let fixture: ComponentFixture<FinancialClaimsAllPaymentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsAllPaymentsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsAllPaymentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
