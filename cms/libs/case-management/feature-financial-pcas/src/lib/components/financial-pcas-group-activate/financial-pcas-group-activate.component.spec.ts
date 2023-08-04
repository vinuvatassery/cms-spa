import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPcasGroupActivateComponent } from './financial-pcas-group-activate.component';

describe('FinancialPcasGroupActivateComponent', () => {
  let component: FinancialPcasGroupActivateComponent;
  let fixture: ComponentFixture<FinancialPcasGroupActivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialPcasGroupActivateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialPcasGroupActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
