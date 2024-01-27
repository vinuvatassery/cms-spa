import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasPageComponent } from './financial-pcas-page.component';

describe('FinancialPcasPageComponent', () => {
  let component: FinancialPcasPageComponent;
  let fixture: ComponentFixture<FinancialPcasPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
