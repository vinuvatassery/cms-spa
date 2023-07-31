import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialClaimsProcessListComponent } from './financial-claims-process-list.component';

describe('FinancialClaimsProcessListComponent', () => {
  let component: FinancialClaimsProcessListComponent;
  let fixture: ComponentFixture<FinancialClaimsProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialClaimsProcessListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialClaimsProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
