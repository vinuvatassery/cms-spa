import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsProviderInfoComponent } from './financial-claims-provider-info.component';

describe('FinancialClaimsProviderInfoComponent', () => {
  let component: FinancialClaimsProviderInfoComponent;
  let fixture: ComponentFixture<FinancialClaimsProviderInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsProviderInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsProviderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
