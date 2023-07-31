import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsUnbatchClaimsComponent } from './financial-claims-unbatch-claims.component';

describe('FinancialClaimsUnbatchClaimsComponent', () => {
  let component: FinancialClaimsUnbatchClaimsComponent;
  let fixture: ComponentFixture<FinancialClaimsUnbatchClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsUnbatchClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsUnbatchClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
