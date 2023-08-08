import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsDeleteClaimsComponent } from './financial-claims-delete-claims.component';

describe('FinancialClaimsDeleteClaimsComponent', () => {
  let component: FinancialClaimsDeleteClaimsComponent;
  let fixture: ComponentFixture<FinancialClaimsDeleteClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsDeleteClaimsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsDeleteClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
