import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectDeactivateComponent } from './financial-pcas-object-deactivate.component';

describe('FinancialPcasObjectDeactivateComponent', () => {
  let component: FinancialPcasObjectDeactivateComponent;
  let fixture: ComponentFixture<FinancialPcasObjectDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectDeactivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
