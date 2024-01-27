import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDrugsDetailsComponent } from './financial-drugs-details.component';

describe('FinancialDrugsDetailsComponent', () => {
  let component: FinancialDrugsDetailsComponent;
  let fixture: ComponentFixture<FinancialDrugsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialDrugsDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialDrugsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
