import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsReconcilePageComponent } from './financial-claims-reconcile-page.component';

describe('FinancialClaimsReconcilePageComponent', () => {
  let component: FinancialClaimsReconcilePageComponent;
  let fixture: ComponentFixture<FinancialClaimsReconcilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsReconcilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsReconcilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
