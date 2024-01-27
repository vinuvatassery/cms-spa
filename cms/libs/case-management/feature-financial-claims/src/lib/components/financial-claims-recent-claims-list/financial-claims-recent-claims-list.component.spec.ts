import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsRecentClaimsListComponent } from './financial-claims-recent-claims-list.component';

describe('FinancialClaimsRecentClaimsListComponent', () => {
  let component: FinancialClaimsRecentClaimsListComponent;
  let fixture: ComponentFixture<FinancialClaimsRecentClaimsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialClaimsRecentClaimsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsRecentClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
