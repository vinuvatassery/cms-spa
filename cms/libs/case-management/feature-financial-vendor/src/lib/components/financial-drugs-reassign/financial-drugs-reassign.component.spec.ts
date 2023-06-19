import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDrugsReassignComponent } from './financial-drugs-reassign.component';

describe('FinancialDrugsReassignComponent', () => {
  let component: FinancialDrugsReassignComponent;
  let fixture: ComponentFixture<FinancialDrugsReassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialDrugsReassignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialDrugsReassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
