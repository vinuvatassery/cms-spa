import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchesListComponent } from './financial-claims-batches-list.component';

describe('FinancialClaimsBatchesListComponent', () => {
  let component: FinancialClaimsBatchesListComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
