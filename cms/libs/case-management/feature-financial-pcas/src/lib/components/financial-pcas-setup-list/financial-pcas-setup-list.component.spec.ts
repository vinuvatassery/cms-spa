import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasSetupListComponent } from './financial-pcas-setup-list.component';

describe('FinancialPcasSetupListComponent', () => {
  let component: FinancialPcasSetupListComponent;
  let fixture: ComponentFixture<FinancialPcasSetupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasSetupListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
