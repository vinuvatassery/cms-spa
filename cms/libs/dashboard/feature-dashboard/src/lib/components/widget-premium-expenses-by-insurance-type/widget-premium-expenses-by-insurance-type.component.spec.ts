import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetPremiumExpensesByInsuranceTypeComponent } from './widget-premium-expenses-by-insurance-type.component';

describe('WidgetPremiumExpensesByInsuranceTypeComponent', () => {
  let component: WidgetPremiumExpensesByInsuranceTypeComponent;
  let fixture: ComponentFixture<WidgetPremiumExpensesByInsuranceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetPremiumExpensesByInsuranceTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      WidgetPremiumExpensesByInsuranceTypeComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
