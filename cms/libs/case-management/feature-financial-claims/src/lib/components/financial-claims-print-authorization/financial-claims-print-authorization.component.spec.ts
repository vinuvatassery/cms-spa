import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsPrintAuthorizationComponent } from './financial-claims-print-authorization.component';

describe('FinancialClaimsPrintAuthorizationComponent', () => {
  let component: FinancialClaimsPrintAuthorizationComponent;
  let fixture: ComponentFixture<FinancialClaimsPrintAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsPrintAuthorizationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsPrintAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
