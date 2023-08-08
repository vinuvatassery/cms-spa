import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsDetailFormComponent } from './financial-claims-detail-form.component';

describe('FinancialClaimsDetailFormComponent', () => {
  let component: FinancialClaimsDetailFormComponent;
  let fixture: ComponentFixture<FinancialClaimsDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsDetailFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
