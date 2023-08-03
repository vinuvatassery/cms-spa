import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchRouterPageComponent } from './financial-claims-router-batch-page.component';

describe('FinancialClaimsBatchRouterPageComponent', () => {
  let component: FinancialClaimsBatchRouterPageComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchRouterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchRouterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchRouterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
