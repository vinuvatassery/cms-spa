import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchPageComponent } from '../financial-claims-batch-page.component;

describe('FinancialClaimsBatchPageComponent', () => {
  let component: FinancialClaimsBatchPageComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
