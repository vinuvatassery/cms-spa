import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupDeactivateComponent } from './financial-pcas-group-deactivate.component';

describe('FinancialPcasGroupDeactivateComponent', () => {
  let component: FinancialPcasGroupDeactivateComponent;
  let fixture: ComponentFixture<FinancialPcasGroupDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
