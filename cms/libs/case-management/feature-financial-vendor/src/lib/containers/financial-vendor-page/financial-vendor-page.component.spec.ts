import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialVandorPageComponent } from './financial-vandor-page.component';

describe('FinancialVandorPageComponent', () => {
  let component: FinancialVandorPageComponent;
  let fixture: ComponentFixture<FinancialVandorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialVandorPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialVandorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
