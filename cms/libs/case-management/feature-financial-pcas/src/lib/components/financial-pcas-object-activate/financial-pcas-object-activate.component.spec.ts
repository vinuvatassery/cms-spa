import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasObjectActivateComponent } from './financial-pcas-object-activate.component';

describe('FinancialPcasObjectActivateComponent', () => {
  let component: FinancialPcasObjectActivateComponent;
  let fixture: ComponentFixture<FinancialPcasObjectActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasObjectActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasObjectActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
