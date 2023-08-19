import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasSetupRemoveComponent } from './financial-pcas-setup-remove.component';

describe('FinancialPcasSetupRemoveComponent', () => {
  let component: FinancialPcasSetupRemoveComponent;
  let fixture: ComponentFixture<FinancialPcasSetupRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasSetupRemoveComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasSetupRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
