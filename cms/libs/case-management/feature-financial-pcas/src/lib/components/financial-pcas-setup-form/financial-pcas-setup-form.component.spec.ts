import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasSetupFormComponent } from './financial-pcas-setup-form.component';

describe('FinancialPcasSetupFormComponent', () => {
  let component: FinancialPcasSetupFormComponent;
  let fixture: ComponentFixture<FinancialPcasSetupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasSetupFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasSetupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
