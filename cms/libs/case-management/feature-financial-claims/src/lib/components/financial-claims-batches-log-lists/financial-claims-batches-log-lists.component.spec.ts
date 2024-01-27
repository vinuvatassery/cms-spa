import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsBatchesLogListsComponent } from './financial-claims-batches-log-lists.component';

describe('FinancialClaimsBatchesLogListsComponent', () => {
  let component: FinancialClaimsBatchesLogListsComponent;
  let fixture: ComponentFixture<FinancialClaimsBatchesLogListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsBatchesLogListsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsBatchesLogListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
