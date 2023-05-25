import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialVandorProfileComponent } from './financial-vandor-profile.component';

describe('FinancialVandorProfileComponent', () => {
  let component: FinancialVandorProfileComponent;
  let fixture: ComponentFixture<FinancialVandorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialVandorProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialVandorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
