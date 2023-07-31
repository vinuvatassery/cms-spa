import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchClaimsComponent } from './financial-claims-batch-claims.component';

describe('FinancialClaimsBatchClaimsComponent', () => {
  let component: FinancialClaimsBatchClaimsComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsBatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
