import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectFormComponent } from './financial-pcas-object-form.component';

describe('FinancialPcasObjectFormComponent', () => {
  let component: FinancialPcasObjectFormComponent;
  let fixture: ComponentFixture<FinancialPcasObjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
